// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Map public authentication gateway

export default router;