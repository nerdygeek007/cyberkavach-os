import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import systemRoutes from './routes/system.routes'; // <-- Your new import

const app = express();

// 1. SECURITY: Open the bridge to your Next.js frontend
app.use(cors({ origin: 'http://localhost:3000' }));

// 2. MIDDLEWARE: Parse JSON bodies
app.use(express.json());

// 3. ROUTES: Mount your endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/system', systemRoutes); // <-- Your new route

export default app;