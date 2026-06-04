// backend/src/controllers/event.controller.ts
import { Request, Response } from 'express'; // <-- Added Request here!
import { AuthRequest } from '../middleware/auth';
import { dbPool } from '../db';

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, description, event_date, venue, max_capacity, ticket_price } = req.body;

    if (!title || !event_date || !venue || !max_capacity) {
        res.status(400).json({ error: 'SYSTEM_HALT: Missing required structural data for event creation.' });
        return;
    }

    try {
        const query = `
            INSERT INTO events (title, description, event_date, venue, max_capacity, ticket_price, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [title, description, event_date, venue, max_capacity, ticket_price || 0.00, req.user?.id];
        const result = await dbPool.query(query, values);

        res.status(201).json({ message: 'Event successfully provisioned.', event: result.rows[0] });
    } catch (error) {
        console.error('[!] Event Creation Failure:', error);
        res.status(500).json({ error: 'SYSTEM_HALT: Internal server exception during event write.' });
    }
};

export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    const { event_id } = req.body;
    const user_id = req.user?.id;

    if (!event_id || !user_id) {
        res.status(400).json({ error: 'SYSTEM_HALT: Malformed target payload constraints.' });
        return;
    }

    const client = await dbPool.connect();

    try {
        await client.query('BEGIN');

        // Row-Level Isolation: Block competing threads
        const lockQuery = 'SELECT max_capacity, current_occupancy FROM events WHERE id = $1 FOR UPDATE;';
        const eventCheck = await client.query(lockQuery, [event_id]);

        if (eventCheck.rows.length === 0) {
            res.status(404).json({ error: 'SYSTEM_HALT: Target event mapping does not exist.' });
            await client.query('ROLLBACK');
            return;
        }

        const { max_capacity, current_occupancy } = eventCheck.rows[0];

        if (current_occupancy >= max_capacity) {
            res.status(422).json({ error: 'SYSTEM_HALT: Registration rejected. Target resource exhaustion (Event Full).' });
            await client.query('ROLLBACK');
            return;
        }

        const registerQuery = `
            INSERT INTO event_registrations (event_id, user_id) 
            VALUES ($1, $2)
            RETURNING id, registered_at;
        `;
        const registrationResult = await client.query(registerQuery, [event_id, user_id]);

        const incrementQuery = 'UPDATE events SET current_occupancy = current_occupancy + 1 WHERE id = $1;';
        await client.query(incrementQuery, [event_id]);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Registration confirmed. Allocation slot secured.',
            ticket: registrationResult.rows[0]
        });

    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
            res.status(409).json({ error: 'SYSTEM_HALT: Abuse vector detected. User already registered.' });
            return;
        }
        console.error('[!] Transaction Aborted:', error);
        res.status(500).json({ error: 'SYSTEM_HALT: Critical data engine collision.' });
    } finally {
        client.release();
    }
};

export const getEventDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params; 

    try {
        const eventQuery = 'SELECT title, max_capacity, current_occupancy, event_date FROM events WHERE id = $1';
        const eventResult = await dbPool.query(eventQuery, [id]);

        if (eventResult.rows.length === 0) {
            res.status(404).json({ error: 'SYSTEM_HALT: Target event mapping does not exist.' });
            return;
        }

        const attendeeQuery = `
            SELECT 
                u.full_name, 
                u.email, 
                er.registration_status,
                er.registered_at 
            FROM event_registrations er
            JOIN users u ON er.user_id = u.id
            WHERE er.event_id = $1
            ORDER BY er.registered_at ASC;
        `;
        const attendeeResult = await dbPool.query(attendeeQuery, [id]);

        res.status(200).json({
            status: 'SUCCESS',
            event_telemetry: eventResult.rows[0],
            total_attendees: attendeeResult.rowCount,
            attendee_ledger: attendeeResult.rows
        });
    } catch (error) {
        console.error('[!] Dashboard Aggregation Failure:', error);
        res.status(500).json({ error: 'SYSTEM_HALT: Internal data aggregation exception.' });
    }
};

export const getEventSummaryList = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                id AS event_id, 
                title, 
                event_date, 
                current_occupancy, 
                max_capacity,
                CASE 
                    WHEN current_occupancy >= max_capacity THEN 'FULL'
                    WHEN event_date < NOW() THEN 'ARCHIVED'
                    ELSE 'OPEN'
                END as status
            FROM events 
            ORDER BY event_date ASC
        `;
        const result = await dbPool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Event Summary List Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};