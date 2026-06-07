import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import systemRoutes from './routes/system.routes';
import certificateRoutes from './routes/certificate.routes';
import pointsRoutes from './routes/points.routes';

const app = express();

// 1. SECURITY: Open the bridge to your Next.js frontend
app.use(cors({ origin: 'http://localhost:3000' }));

// 2. MIDDLEWARE: Parse JSON bodies
app.use(express.json());

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 3. ROUTES: Mount your endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/points', pointsRoutes);

export default app;