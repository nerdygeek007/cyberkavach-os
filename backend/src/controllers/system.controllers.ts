import { Request, Response } from 'express';
import { dbPool } from '../db';

export const getSystemDashboard = async (req: Request, res: Response) => {
    try {
        const [usersResult, eventsResult, registrationsResult] = await Promise.all([
            dbPool.query('SELECT COUNT(*) FROM users'),
            dbPool.query('SELECT COUNT(*) FROM events'),
            dbPool.query('SELECT COUNT(*) FROM event_registrations')
        ]);

        res.status(200).json({
            total_users: parseInt(usersResult.rows[0].count),
            total_events: parseInt(eventsResult.rows[0].count),
            total_registrations: parseInt(registrationsResult.rows[0].count),
            active_sessions: 24 // Hardcoded until we wire up Redis
        });
    } catch (error) {
        console.error("System Dashboard Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
