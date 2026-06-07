// backend/src/tests/run_all_tests.ts
import { Request, Response } from 'express';
import { getJobStatus, uploadTemplate, generateCertificates } from '../controllers/certificate.controller';
import { assignPoints } from '../controllers/points.controller';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// Mock Request Generator
function mockReq(overrides: any = {}): AuthRequest {
    return {
        params: {},
        query: {},
        body: {},
        headers: {},
        user: {
            id: 'ghost-dev-id',
            role: 'Super Admin',
            clearance: 5,
            account_status: 'ACTIVE'
        },
        ...overrides
    } as unknown as AuthRequest;
}

// Mock Response Generator
interface MockResponse extends Response {
    _status?: number;
    _json?: any;
    _downloadPath?: string;
}
function mockRes(): MockResponse {
    const res: any = {};
    res.status = (code: number) => {
        res._status = code;
        return res;
    };
    res.json = (data: any) => {
        res._json = data;
        return res;
    };
    res.download = (filePath: string) => {
        res._downloadPath = filePath;
        return res;
    };
    return res;
}

async function runUnitTests() {
    console.log('\n--- 🧪 RUNNING UNIT TESTS (MOCK CONTROLLER CALLS) ---');

    // Unit Test 1: getJobStatus with missing job
    {
        const req = mockReq({ params: { jobId: 'non-existent-job-uuid' } });
        const res = mockRes();
        await getJobStatus(req, res);
        if (res._status === 404 && res._json?.error === 'Job not found') {
            console.log('✅ Unit Test 1 Passed: getJobStatus returns 404 for missing jobs.');
        } else {
            console.error('❌ Unit Test 1 Failed:', res._status, res._json);
            process.exit(1);
        }
    }

    // Unit Test 2: uploadTemplate with no file
    {
        const req = mockReq({ file: undefined });
        const res = mockRes();
        await uploadTemplate(req, res);
        if (res._status === 400 && res._json?.error?.includes('No file uploaded')) {
            console.log('✅ Unit Test 2 Passed: uploadTemplate rejects missing file uploads.');
        } else {
            console.error('❌ Unit Test 2 Failed:', res._status, res._json);
            process.exit(1);
        }
    }

    // Unit Test 3: generateCertificates missing params
    {
        const req = mockReq({ body: {} });
        const res = mockRes();
        await generateCertificates(req, res);
        if (res._status === 400 && res._json?.error?.includes('Missing required parameters')) {
            console.log('✅ Unit Test 3 Passed: generateCertificates rejects missing payload parameters.');
        } else {
            console.error('❌ Unit Test 3 Failed:', res._status, res._json);
            process.exit(1);
        }
    }

    // Unit Test 4: assignPoints invalid category
    {
        const req = mockReq({
            body: {
                user_id: 'd25dce16-7288-4e8c-8f9f-ac8d6bb9edee',
                points: 10,
                category: 'Bad Category',
                remarks: 'Testing invalid categories'
            }
        });
        const res = mockRes();
        await assignPoints(req, res);
        if (res._status === 400 && res._json?.error?.includes('Invalid category')) {
            console.log('✅ Unit Test 4 Passed: assignPoints rejects invalid categories.');
        } else {
            console.error('❌ Unit Test 4 Failed:', res._status, res._json);
            process.exit(1);
        }
    }

    // Unit Test 5: assignPoints negative score without Policy Violation
    {
        const req = mockReq({
            body: {
                user_id: 'd25dce16-7288-4e8c-8f9f-ac8d6bb9edee',
                points: -10,
                category: 'Technical Contribution',
                remarks: 'Invalid combination'
            }
        });
        const res = mockRes();
        await assignPoints(req, res);
        if (res._status === 400 && res._json?.error?.includes('Deductions must fall under')) {
            console.log('✅ Unit Test 5 Passed: assignPoints rejects negative points outside of Policy Violations.');
        } else {
            console.error('❌ Unit Test 5 Failed:', res._status, res._json);
            process.exit(1);
        }
    }
}

async function runIntegrationTests() {
    console.log('\n--- 🧪 RUNNING INTEGRATION TESTS (REAL API REQUESTS) ---');
    const API_BASE = 'http://localhost:5000/api/v1';
    const authHeaders = {
        'Authorization': 'Bearer test-dev-token'
    };

    // 1. Template Upload
    console.log('[*] Integration Test 1: Uploading Template Image...');
    const pngBytes = Buffer.from(
        '89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4340000000D49444154789C636000010000FFFF0300000600055771AD460000000049454E44AE426082',
        'hex'
    );
    const formData = new FormData();
    const blob = new Blob([pngBytes], { type: 'image/png' });
    formData.append('template', blob, 'test_template.png');

    const uploadRes = await fetch(`${API_BASE}/certificates/upload-template`, {
        method: 'POST',
        headers: authHeaders,
        body: formData
    });

    if (uploadRes.status !== 201) {
        console.error('❌ Integration Test 1 Failed: upload template returned status', uploadRes.status);
        process.exit(1);
    }
    const uploadData = await uploadRes.json() as any;
    const templateFilename = uploadData.filename;
    console.log('✅ Integration Test 1 Passed: Template uploaded. Filename:', templateFilename);

    // 2. Bulk Certificate Generation
    console.log('[*] Integration Test 2: Triggering Bulk Certificate Generation...');
    const genPayload = {
        event_id: '7b6d6e7a-31bc-4461-9b98-0d8a32ed6a7f',
        template_filename: templateFilename,
        options: {
            name_x: 100,
            name_y: 250,
            name_size: 24,
            event_x: 100,
            event_y: 180
        },
        participants: [
            { name: 'Integration Test Participant A', email: 'test_a@cyberkavach.local' },
            { name: 'Integration Test Participant B', email: 'test_b@cyberkavach.local' }
        ]
    };

    const genRes = await fetch(`${API_BASE}/certificates/generate`, {
        method: 'POST',
        headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(genPayload)
    });

    if (genRes.status !== 202) {
        console.error('❌ Integration Test 2 Failed: generate endpoint returned status', genRes.status);
        process.exit(1);
    }
    const genData = await genRes.json() as any;
    const jobId = genData.jobId;
    console.log('✅ Integration Test 2 Passed: Generation job started. Job ID:', jobId);

    // 3. Poll Job Progress
    console.log('[*] Integration Test 3: Polling Job Progress...');
    let status = 'GENERATING';
    let pollCount = 0;
    while (status === 'GENERATING' && pollCount < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusRes = await fetch(`${API_BASE}/certificates/job/${jobId}`, { headers: authHeaders });
        const statusData = await statusRes.json() as any;
        status = statusData.status;
        console.log(`    -> Poll ${++pollCount}: status = ${status}`);
    }

    if (status !== 'COMPLETED') {
        console.error('❌ Integration Test 3 Failed: Job status did not complete, ended with:', status);
        process.exit(1);
    }
    console.log('✅ Integration Test 3 Passed: Job successfully completed.');

    // 4. Verify Certificate Registry
    console.log('[*] Integration Test 4: Querying Certificate List...');
    const listRes = await fetch(`${API_BASE}/certificates/list`, { headers: authHeaders });
    const listData = await listRes.json() as any;
    const certs = listData.certificates || [];
    if (certs.length === 0) {
        console.error('❌ Integration Test 4 Failed: No certificates in registry.');
        process.exit(1);
    }
    const targetCertCode = certs[0].certificate_code;
    console.log('✅ Integration Test 4 Passed: Registry query successful. Sample code:', targetCertCode);

    // 5. Public Verification Route
    console.log('[*] Integration Test 5: Running Public Verification...');
    const verifyRes = await fetch(`${API_BASE}/certificates/verify/${targetCertCode}`);
    const verifyData = await verifyRes.json() as any;
    if (!verifyData.verified) {
        console.error('❌ Integration Test 5 Failed: Verification failed.');
        process.exit(1);
    }
    console.log('✅ Integration Test 5 Passed: Verification succeeded. Recipient:', verifyData.certificate.recipient_name);

    // 6. Public File Download
    console.log('[*] Integration Test 6: Running Public Download...');
    const downloadRes = await fetch(`${API_BASE}/certificates/download/${targetCertCode}`);
    if (downloadRes.status !== 200) {
        console.error('❌ Integration Test 6 Failed: Download returned status', downloadRes.status);
        process.exit(1);
    }
    console.log('✅ Integration Test 6 Passed: Download successful.');

    // 7. Email Dispatch Check (Ethereal test preview)
    console.log('[*] Integration Test 7: Testing Email Dispatch...');
    const emailRes = await fetch(`${API_BASE}/certificates/email/${targetCertCode}`, {
        method: 'POST',
        headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'integration_tester@cyberkavach.local' })
    });
    if (emailRes.status !== 200) {
        console.error('❌ Integration Test 7 Failed: Email dispatch returned status', emailRes.status);
        process.exit(1);
    }
    const emailData = await emailRes.json() as any;
    console.log('✅ Integration Test 7 Passed: Email dispatched. Preview URL:', emailData.preview);

    // 8. Assign Points Test
    console.log('[*] Integration Test 8: Assigning Appreciation Points...');
    const assignPayload = {
        user_id: '5a19b28f-818a-4633-bf77-13f37dd65445', // Bob Vulnerability (seeded in DB)
        points: 50,
        category: 'Innovation Award',
        remarks: 'Pioneered custom TypeScript integration test suite runner.',
        event_id: '7b6d6e7a-31bc-4461-9b98-0d8a32ed6a7f'
    };
    const assignRes = await fetch(`${API_BASE}/points/assign`, {
        method: 'POST',
        headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignPayload)
    });
    if (assignRes.status !== 201) {
        console.error('❌ Integration Test 8 Failed: Assign points returned status', assignRes.status);
        process.exit(1);
    }
    console.log('✅ Integration Test 8 Passed: Points assigned successfully.');

    // 9. Deduct Points Violation Test
    console.log('[*] Integration Test 9: Deducting Points (Policy Violation)...');
    const deductPayload = {
        user_id: '5a19b28f-818a-4633-bf77-13f37dd65445',
        points: -15,
        category: 'Policy Violation',
        remarks: 'Testing test log deduction check.',
        event_id: '7b6d6e7a-31bc-4461-9b98-0d8a32ed6a7f'
    };
    const deductRes = await fetch(`${API_BASE}/points/assign`, {
        method: 'POST',
        headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deductPayload)
    });
    if (deductRes.status !== 201) {
        console.error('❌ Integration Test 9 Failed: Deduct points returned status', deductRes.status);
        process.exit(1);
    }
    console.log('✅ Integration Test 9 Passed: Points deduction logged successfully.');

    // 10. Query Leaderboard & Dashboard
    console.log('[*] Integration Test 10: Querying Leaderboard & Dashboard...');
    const lbRes = await fetch(`${API_BASE}/points/leaderboard`);
    const lbData = await lbRes.json() as any;
    if (!lbData.leaderboard) {
        console.error('❌ Integration Test 10 Failed: Leaderboard data missing.');
        process.exit(1);
    }

    const dbRes = await fetch(`${API_BASE}/points/user/5a19b28f-818a-4633-bf77-13f37dd65445`, { headers: authHeaders });
    const dbData = await dbRes.json() as any;
    if (dbData.total_points === undefined) {
        console.error('❌ Integration Test 10 Failed: Dashboard total_points data missing.');
        process.exit(1);
    }
    console.log('✅ Integration Test 10 Passed: Leaderboard and Dashboard verified.');

    // 11. Report Export CSV
    console.log('[*] Integration Test 11: Exporting recognition report CSV...');
    const reportRes = await fetch(`${API_BASE}/points/report`, { headers: authHeaders });
    if (reportRes.status !== 200) {
        console.error('❌ Integration Test 11 Failed: Report export returned status', reportRes.status);
        process.exit(1);
    }
    const reportText = await reportRes.text();
    if (!reportText.includes('Student ID') || !reportText.includes('Total Points')) {
        console.error('❌ Integration Test 11 Failed: Export contents invalid.');
        process.exit(1);
    }
    console.log('✅ Integration Test 11 Passed: Recognition report exported successfully.');
}

async function start() {
    try {
        await runUnitTests();
        await runIntegrationTests();
        console.log('\n🌟🌟 ALL UNIT AND INTEGRATION TESTS COMPLETED SUCCESSFULLY! 🌟🌟\n');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ CRITICAL EXCEPTION RUNNING TESTS:', err);
        process.exit(1);
    }
}

start();
