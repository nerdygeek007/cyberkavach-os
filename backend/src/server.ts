// backend/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { dbPool } from './db'; 
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import systemRoutes from './routes/system.routes';

dotenv.config();

// Assert strict runtime dependencies exist before allocating memory
if (!process.env.JWT_SECRET) {
    console.error('[!] FATAL SYSTEM CONFIGURATION ERROR: JWT_SECRET environment variable is not defined.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// ZERO-TRUST MIDDLEWARE BOUNDARIES
// ==========================================
app.use(helmet()); 

// EXPANDED CORS VIP LIST
const allowedOrigins = [
    'http://localhost:3000',
    'http://172.29.176.1:3000' // Your specific network IP
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true 
}));

app.use(express.json()); 

// ==========================================
// ROUTER MOUNTS
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/system', systemRoutes);

// ==========================================
// SYSTEM HEALTH & DB VERIFICATION
// ==========================================
app.get('/api/v1/health', async (req: Request, res: Response) => {
    try {
        const dbResult = await dbPool.query('SELECT NOW() as current_time, current_database() as db_name');
        
        res.status(200).json({
            status: 'OPERATIONAL',
            timestamp: dbResult.rows[0].current_time,
            database: dbResult.rows[0].db_name,
            message: 'CyberKavach OS Backend is live and connected to PostgreSQL.'
        });
    } catch (error) {
        console.error('[!] Database connection failed:', error);
        res.status(500).json({
            status: 'DEGRADED',
            message: 'Failed to establish database connection.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// ==========================================
// SERVER IGNITION
// ==========================================
app.listen(PORT, () => {
    console.log(`[*] CyberKavach OS Backend running on port ${PORT}`);
    console.log(`[*] Awaiting requests at http://localhost:${PORT}/api/v1/health`);

});
