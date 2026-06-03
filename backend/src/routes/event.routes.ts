// backend/src/routes/event.routes.ts
import { Router } from 'express';
import { createEvent, registerForEvent } from '../controllers/event.controllers';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// High-Privilege Entry Point: Restrict creation to Core Committee and higher roles
router.post(
    '/create', 
    requireAuth, 
    requireRole(['Super Admin', 'Club Coordinator', 'Faculty Coordinator', 'Technical Lead', 'Core Committee Member']), 
    createEvent
); // <-- THIS WAS MISSING

// Publicly Authenticated Point: Any active user can reserve an allocation slot
router.post('/register', requireAuth, registerForEvent);

export default router;