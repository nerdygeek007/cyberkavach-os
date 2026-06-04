// backend/src/routes/event.routes.ts
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { createEvent, registerForEvent, getEventDashboard } from '../controllers/event.controllers';
const router = Router();
import { getEventSummaryList } from '../controllers/event.controllers';

// Add this line NEAR THE TOP of your routes, BEFORE any routes that use /:id
router.get('/summary-list', getEventSummaryList); // Temporarily no requireAuth for testing

// High-Privilege Entry Point: Restrict creation to Core Committee and higher roles
router.post(
    '/create', 
    requireAuth, 
    requireRole(['Super Admin', 'Club Coordinator', 'Faculty Coordinator', 'Technical Lead', 'Core Committee Member']), 
    createEvent
);

// Admin Telemetry: View event stats and attendee ledger
router.get(
    '/:id/dashboard',
    requireAuth,
    requireRole(['Super Admin', 'Core Committee Member', 'Club Coordinator']), 
    getEventDashboard
);

// Publicly Authenticated Point: Any active user can reserve an allocation slot
router.post('/register', requireAuth, registerForEvent);

export default router;