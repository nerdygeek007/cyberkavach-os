// backend/src/routes/certificate.routes.ts
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/auth';
import {
    uploadTemplate,
    generateCertificates,
    verifyCertificate,
    getCertificateList,
    getJobStatus,
    downloadCertificate,
    emailCertificate
} from '../controllers/certificate.controller';

const router = Router();

// Configure multer storage for templates
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '../../uploads/templates');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `template-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.png', '.jpg', '.jpeg', '.pdf'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('SYSTEM_HALT: Only images (PNG/JPG) and PDFs are allowed.'));
        }
    }
});

// Endpoint: Upload template file
router.post('/upload-template', requireAuth, upload.single('template'), uploadTemplate);

// Endpoint: Generate bulk certificates
router.post('/generate', requireAuth, generateCertificates);

// Endpoint: Get progress of bulk job
router.get('/job/:jobId', requireAuth, getJobStatus);

// Endpoint: Public Verification (No Auth Required)
router.get('/verify/:code', verifyCertificate);

// Endpoint: Dedicated File Download by Code (Public)
router.get('/download/:code', downloadCertificate);

// Endpoint: Dispatch email directly
router.post('/email/:code', requireAuth, emailCertificate);

// Endpoint: Get list of certificates
router.get('/list', requireAuth, getCertificateList);

export default router;
