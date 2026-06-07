// backend/src/routes/points.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
    assignPoints,
    getLeaderboard,
    getMemberPointsDashboard,
    exportRecognitionReport
} from '../controllers/points.controller';

const router = Router();

// Endpoint: Assign points (Coordinators only - auth validation is in controller)
router.post('/assign', requireAuth, assignPoints);

// Endpoint: Contribution Leaderboard (Publicly visible to members/coords)
router.get('/leaderboard', getLeaderboard);

// Endpoint: Export Points Report (Coordinators only)
router.get('/report', requireAuth, exportRecognitionReport);

// Endpoint: Current user's points dashboard
router.get('/my-points', requireAuth, getMemberPointsDashboard);

// Endpoint: Specific member's points dashboard (For coordination reviews)
router.get('/user/:userId', requireAuth, getMemberPointsDashboard);

export default router;
