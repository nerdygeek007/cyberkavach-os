import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getSystemDashboard } from '../controllers/system.controllers';

const router = Router();

// Temporarily removing requireAuth just to test the connection easily. 
// We will add it back once the frontend successfully fetches data!
router.get('/dashboard', getSystemDashboard); 

export default router;