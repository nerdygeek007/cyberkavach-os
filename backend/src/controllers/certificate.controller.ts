// backend/src/controllers/certificate.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dbPool } from '../db';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import archiver = require('archiver');
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// In-memory job progress tracker
const jobsProgress: { [jobId: string]: { total: number; current: number; status: string; zipPath?: string } } = {};

export const getJobStatus = async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params;
    const job = jobsProgress[jobId as string];
    if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
    }
    res.status(200).json(job);
};

// Multer template upload handled in routes, this endpoint confirms upload
export const uploadTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: 'SYSTEM_HALT: No file uploaded.' });
        return;
    }

    res.status(201).json({
        message: 'Template uploaded successfully.',
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/templates/${req.file.filename}`
    });
};

export const generateCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
    const { event_id, template_filename, options, participants } = req.body;

    if (!event_id || !template_filename || !participants || !Array.isArray(participants)) {
        res.status(400).json({ error: 'SYSTEM_HALT: Missing required parameters.' });
        return;
    }

    // 1. Authorization & Policy enforcement
    // "Authorized to Generate: Student Coordinator, Social Media Coordinator (with Student Coordinator approval)."
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const isStudentCoordOrAbove = ['Super Admin', 'Club Coordinator', 'Faculty Coordinator'].includes(userRole || '');
    let authorized = isStudentCoordOrAbove;

    if (!authorized && userRole === 'Core Committee Member') { // Social Media / Content Coordinator mapped to Core Committee in DB
        // Check if there is an approved certificate request for this event
        try {
            const approvalQuery = `
                SELECT id FROM requests 
                WHERE requester_id = $1 
                  AND request_type = 'CERTIFICATE' 
                  AND status = 'APPROVED' 
                  AND (details->>'event_id') = $2
                LIMIT 1;
            `;
            const approvalResult = await dbPool.query(approvalQuery, [userId, event_id]);
            if (approvalResult.rows.length > 0) {
                authorized = true;
            }
        } catch (err) {
            console.error('Error verifying approval requests:', err);
        }
    }

    if (!authorized) {
        res.status(403).json({ error: 'SYSTEM_HALT: Privilege validation failed. Certificate generation requires authorization.' });
        return;
    }

    // Check if event exists
    let eventTitle = '';
    try {
        const eventRes = await dbPool.query('SELECT title FROM events WHERE id = $1 LIMIT 1', [event_id]);
        if (eventRes.rows.length === 0) {
            res.status(404).json({ error: 'Event not found.' });
            return;
        }
        eventTitle = eventRes.rows[0].title;
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching event.' });
        return;
    }

    const templatePath = path.join(__dirname, '../../uploads/templates', template_filename);
    if (!fs.existsSync(templatePath)) {
        res.status(400).json({ error: 'SYSTEM_HALT: Template file not found.' });
        return;
    }

    // Create unique job id
    const jobId = crypto.randomUUID();
    jobsProgress[jobId] = { total: participants.length, current: 0, status: 'GENERATING' };

    const isUUID = (str: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(str);
    };
    const issuerId = userId && isUUID(userId) ? userId : '2690965e-c8f9-496a-ac07-690f86ad9937';

    // Respond immediately to the client with the Job ID for progress tracking
    res.status(202).json({
        message: 'Bulk certificate generation initiated.',
        jobId
    });

    // Run the generation asynchronously
    (async () => {
        try {
            const outDir = path.join(__dirname, '../../uploads/generated', jobId);
            if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir, { recursive: true });
            }

            const templateBytes = fs.readFileSync(templatePath);
            const isPDF = template_filename.toLowerCase().endsWith('.pdf');

            const generatedCerts: Array<{ code: string; name: string; file_url: string }> = [];

            // Configure text overlays (coordinates from caller or defaults)
            const textOpts = {
                name_x: options?.name_x ?? 200,
                name_y: options?.name_y ?? 350,
                name_size: options?.name_size ?? 32,
                event_x: options?.event_x ?? 200,
                event_y: options?.event_y ?? 250,
                event_size: options?.event_size ?? 20,
                date_x: options?.date_x ?? 200,
                date_y: options?.date_y ?? 180,
                date_size: options?.date_size ?? 14,
                code_x: options?.code_x ?? 200,
                code_y: options?.code_y ?? 120,
                code_size: options?.code_size ?? 12,
            };

            for (let i = 0; i < participants.length; i++) {
                const participant = participants[i];
                if (!participant.name) {
                    jobsProgress[jobId].current++;
                    continue;
                }

                // Generate Unique Certificate Code: CK-[EVENT-INIT]-[RANDOM-HEX]
                const eventInitials = eventTitle.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
                const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
                const certCode = participant.certificate_code || `CK-${eventInitials}-${randomHex}-${i+1}`;

                let pdfBytes: Uint8Array;

                if (isPDF) {
                    const pdfDoc = await PDFDocument.load(templateBytes);
                    const pages = pdfDoc.getPages();
                    const page = pages[0]!;
                    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

                    // Overlay text
                    page.drawText(participant.name, {
                        x: textOpts.name_x,
                        y: textOpts.name_y,
                        size: textOpts.name_size,
                        font: fontBold,
                        color: rgb(0, 0, 0)
                    });

                    page.drawText(eventTitle, {
                        x: textOpts.event_x,
                        y: textOpts.event_y,
                        size: textOpts.event_size,
                        font: fontBold,
                        color: rgb(0.1, 0.4, 0.8)
                    });

                    page.drawText(new Date().toLocaleDateString(), {
                        x: textOpts.date_x,
                        y: textOpts.date_y,
                        size: textOpts.date_size,
                        font: fontRegular,
                        color: rgb(0.3, 0.3, 0.3)
                    });

                    page.drawText(`Verify ID: ${certCode}`, {
                        x: textOpts.code_x,
                        y: textOpts.code_y,
                        size: textOpts.code_size,
                        font: fontRegular,
                        color: rgb(0.5, 0.5, 0.5)
                    });

                    pdfBytes = await pdfDoc.save();
                } else {
                    // It is an image template (PNG/JPG)
                    const pdfDoc = await PDFDocument.create();
                    // Typical landscape letter size page
                    const page = pdfDoc.addPage([792, 612]);
                    
                    let image;
                    if (template_filename.toLowerCase().endsWith('.png')) {
                        image = await pdfDoc.embedPng(templateBytes);
                    } else {
                        image = await pdfDoc.embedJpg(templateBytes);
                    }

                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: 792,
                        height: 612
                    });

                    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

                    // Overlay text (scaling coordinates slightly for 792x612 canvas)
                    page.drawText(participant.name, {
                        x: textOpts.name_x,
                        y: textOpts.name_y,
                        size: textOpts.name_size,
                        font: fontBold,
                        color: rgb(0, 0, 0)
                    });

                    page.drawText(eventTitle, {
                        x: textOpts.event_x,
                        y: textOpts.event_y,
                        size: textOpts.event_size,
                        font: fontBold,
                        color: rgb(0.1, 0.4, 0.8)
                    });

                    page.drawText(new Date().toLocaleDateString(), {
                        x: textOpts.date_x,
                        y: textOpts.date_y,
                        size: textOpts.date_size,
                        font: fontRegular,
                        color: rgb(0.3, 0.3, 0.3)
                    });

                    page.drawText(`Verify ID: ${certCode}`, {
                        x: textOpts.code_x,
                        y: textOpts.code_y,
                        size: textOpts.code_size,
                        font: fontRegular,
                        color: rgb(0.5, 0.5, 0.5)
                    });

                    pdfBytes = await pdfDoc.save();
                }

                // Write single certificate file to disk
                const certFilename = `${certCode}.pdf`;
                const certFilePath = path.join(outDir, certFilename);
                fs.writeFileSync(certFilePath, pdfBytes);

                // Find participant user_id if they exist in the DB (based on email)
                let user_id = null;
                const userRes = await dbPool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [participant.email?.toLowerCase()]);
                if (userRes.rows.length > 0) {
                    user_id = userRes.rows[0].id;
                }

                // Save record to DB
                const insertQuery = `
                    INSERT INTO certificates (certificate_code, user_id, event_id, recipient_name, event_name, issued_by, template_url, file_url)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id;
                `;
                await dbPool.query(insertQuery, [
                    certCode,
                    user_id,
                    event_id,
                    participant.name,
                    eventTitle,
                    issuerId,
                    `/uploads/templates/${template_filename}`,
                    `/uploads/generated/${jobId}/${certFilename}`
                ]);

                generatedCerts.push({
                    code: certCode,
                    name: participant.name,
                    file_url: `/uploads/generated/${jobId}/${certFilename}`
                });

                // Update Progress
                jobsProgress[jobId].current = i + 1;
            }

            // Create ZIP archive
            const zipFilename = `certificates_${jobId}.zip`;
            const zipPath = path.join(__dirname, '../../uploads/generated', zipFilename);
            const output = fs.createWriteStream(zipPath);
            const ZipArchive = (require('archiver') as any).ZipArchive;
            const archive = new ZipArchive({ zlib: { level: 9 } });

            output.on('close', () => {
                jobsProgress[jobId].status = 'COMPLETED';
                jobsProgress[jobId].zipPath = `/uploads/generated/${zipFilename}`;
            });

            archive.on('error', (err: any) => {
                throw err;
            });

            archive.pipe(output);
            archive.directory(outDir, false);
            await archive.finalize();

        } catch (err) {
            console.error('Job generation failed:', err);
            jobsProgress[jobId].status = 'FAILED';
        }
    })();
};

// Verification Endpoint (Public - No Auth Required)
export const verifyCertificate = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;

    try {
        const query = `
            SELECT c.id, c.certificate_code, c.recipient_name, c.event_name, c.issued_at, 
                   u.full_name as issued_by_name
            FROM certificates c
            LEFT JOIN users u ON c.issued_by = u.id
            WHERE c.certificate_code = $1 LIMIT 1;
        `;
        const result = await dbPool.query(query, [code]);

        if (result.rows.length === 0) {
            res.status(404).json({ verified: false, error: 'Certificate not found or invalid code.' });
            return;
        }

        res.status(200).json({
            verified: true,
            certificate: result.rows[0]
        });
    } catch (err) {
        console.error('Verification query failed:', err);
        res.status(500).json({ error: 'SYSTEM_HALT: Database query error.' });
    }
};

// Get list of certificates issued
export const getCertificateList = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const isCoord = ['Super Admin', 'Club Coordinator', 'Faculty Coordinator', 'Technical Lead', 'Core Committee Member'].includes(userRole || '');

    try {
        let query: string;
        let params: any[] = [];

        if (isCoord) {
            // Coordinators see all certificates
            query = `
                SELECT c.id, c.certificate_code, c.recipient_name, c.event_name, c.issued_at, c.file_url,
                       u.email as recipient_email
                FROM certificates c
                LEFT JOIN users u ON c.user_id = u.id
                ORDER BY c.issued_at DESC;
            `;
            params = [];
        } else {
            // Standard members only see their own certificates
            query = `
                SELECT id, certificate_code, recipient_name, event_name, issued_at, file_url
                FROM certificates
                WHERE user_id = $1
                ORDER BY issued_at DESC;
            `;
            params = [userId];
        }

        const result = await dbPool.query(query, params);
        res.status(200).json({ certificates: result.rows });
    } catch (err) {
        res.status(500).json({ error: 'Database exception fetching certificate list.' });
    }
};

// Dedicated file download by code
export const downloadCertificate = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;

    try {
        const query = 'SELECT file_url, recipient_name FROM certificates WHERE certificate_code = $1 LIMIT 1;';
        const result = await dbPool.query(query, [code]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Certificate not found.' });
            return;
        }

        const cert = result.rows[0];
        const filePath = path.join(__dirname, '../..', cert.file_url);

        if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: 'Certificate file does not exist on disk.' });
            return;
        }

        res.download(filePath, `Certificate_${code}.pdf`);
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'SYSTEM_HALT: Download error.' });
    }
};

// Send single certificate email directly
export const emailCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
    const { code } = req.params;
    const { email } = req.body;

    try {
        const query = `
            SELECT c.recipient_name, c.event_name, c.file_url, u.email as user_email
            FROM certificates c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.certificate_code = $1 LIMIT 1;
        `;
        const result = await dbPool.query(query, [code]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Certificate not found.' });
            return;
        }

        const cert = result.rows[0];
        const targetEmail = email || cert.user_email;

        if (!targetEmail) {
            res.status(400).json({ error: 'SYSTEM_HALT: No recipient email address available.' });
            return;
        }

        const filePath = path.join(__dirname, '../..', cert.file_url);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: 'Certificate file does not exist on disk.' });
            return;
        }

        // Configure transporter
        const transporter = await (async () => {
            if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                return nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '587', 10),
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });
            }
            const testAccount = await nodemailer.createTestAccount();
            return nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
        })();

        const verifyUrl = `http://localhost:3000/verify/${code}`;

        // Resolve logo path dynamically to support both dev and prod environments
        let logoPath = path.join(process.cwd(), 'src/assets/cyberkavach_logo.png');
        if (!fs.existsSync(logoPath)) {
            logoPath = path.join(process.cwd(), 'dist/assets/cyberkavach_logo.png');
        }
        if (!fs.existsSync(logoPath)) {
            logoPath = path.join(__dirname, '../assets/cyberkavach_logo.png');
        }

        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CyberKavach OS - Certificate Granted</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050811; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050811; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0c1020; border: 1px solid #10b981; border-radius: 8px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15); overflow: hidden;">
                  <!-- Header Banner -->
                  <tr>
                    <td style="background-color: #0f172a; padding: 32px 24px; border-bottom: 1px solid #1f2937; text-align: center;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding-bottom: 16px;">
                            <img src="cid:cyberkavach_logo" alt="CyberKavach Logo" width="100" height="100" style="display: block; border: 0; outline: none; text-decoration: none;" />
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <div style="color: #10b981; font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; letter-spacing: 3px; margin-bottom: 8px;">
                              &gt; CYBERKAVACH_OS // SECURE_DISPATCH
                            </div>
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">
                              Official Certificate Issued
                            </h1>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Content Body -->
                  <tr>
                    <td style="padding: 32px 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                      <p style="margin-top: 0; margin-bottom: 20px;">
                        Hello <strong style="color: #ffffff;">${cert.recipient_name}</strong>,
                      </p>
                      <p style="margin-bottom: 24px;">
                        Congratulations! The CyberKavach Board has officially generated and issued your achievement/participation credential for the event operation detailed below.
                      </p>
                      
                      <!-- Details Panel -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #070a13; border: 1px solid #1e293b; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding-bottom: 12px;">
                            <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Event Name</span>
                            <span style="color: #ffffff; font-weight: bold; font-size: 16px;">${cert.event_name}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 12px; border-top: 1px solid #1e293b; padding-top: 12px;">
                            <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Credential ID</span>
                            <code style="color: #10b981; font-family: 'Courier New', monospace; font-weight: bold; font-size: 15px; background-color: #111b27; padding: 4px 8px; border-radius: 4px; border: 1px solid #0f5b3c; display: inline-block;">${code}</code>
                          </td>
                        </tr>
                        <tr>
                          <td style="border-top: 1px solid #1e293b; padding-top: 12px;">
                            <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Verification URL</span>
                            <a href="${verifyUrl}" target="_blank" style="color: #10b981; font-family: 'Courier New', monospace; font-size: 13px; text-decoration: none; word-break: break-all;">${verifyUrl}</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin-bottom: 28px;">
                        Your secure PDF certificate is attached to this email. It contains a cryptographic QR code that allows anyone to verify its authenticity instantly.
                      </p>
                      
                      <!-- CTA Button -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center">
                            <a href="${verifyUrl}" target="_blank" style="background-color: #10b981; color: #050811 !important; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 14px; letter-spacing: 1px; display: inline-block; text-align: center;">
                              VERIFY CREDENTIAL SECURELY
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #090d1a; padding: 24px; border-top: 1px solid #1f2937; text-align: center; color: #475569; font-size: 11px; line-height: 1.5;">
                      This is an automated cryptographic dispatch from the CyberKavach OS Core. 
                      <br>
                      Please do not reply directly to this email. For support, contact your Faculty Coordinator.
                      <br>
                      <span style="color: #10b981; font-family: 'Courier New', monospace; display: block; margin-top: 8px;">[ SYSTEM_STATUS: SECURE ]</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"CyberKavach Board" <${process.env.SMTP_FROM || 'noreply@cyberkavach.local'}>`,
            to: targetEmail,
            subject: `Official Certificate for ${cert.event_name}`,
            text: `Hello ${cert.recipient_name},\n\nCongratulations on completing the event: ${cert.event_name}!\n\nAttached is your official certificate.\n\nVerification Code: ${code}\n\nBest regards,\nCyberKavach Board`,
            html: htmlTemplate,
            attachments: [
                {
                    filename: 'cyberkavach_logo.png',
                    path: logoPath,
                    cid: 'cyberkavach_logo'
                },
                {
                    filename: `Certificate_${code}.pdf`,
                    path: filePath
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`[+] Ethereal Email sent preview URL: ${previewUrl}`);
        }

        res.status(200).json({
            message: 'Certificate email dispatched successfully.',
            to: targetEmail,
            preview: previewUrl || undefined
        });

    } catch (err: any) {
        console.error('Email error:', err);
        res.status(500).json({ error: 'SYSTEM_HALT: Email dispatch failure.', details: err.message });
    }
};
