// backend/src/controllers/points.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dbPool } from '../db';

// Categories defined by problem statement
const VALID_CATEGORIES = [
    'Best Coordinator',
    'Best Volunteer',
    'Technical Contribution',
    'Creative Contribution',
    'Event Management Excellence',
    'Community Builder',
    'Innovation Award',
    'Policy Violation' // For deductions
];

// Define Badge Milestones
const getBadgesForPoints = (points: number): string[] => {
    const badges: string[] = [];
    if (points >= 50) badges.push('Bronze Contributor');
    if (points >= 100) badges.push('Silver Contributor');
    if (points >= 200) badges.push('Gold Contributor');
    if (points >= 500) badges.push('Platinum Contributor');
    if (points >= 1000) badges.push('Cyber Sentinel');
    return badges;
};

// Endpoint: Assign Points
export const assignPoints = async (req: AuthRequest, res: Response): Promise<void> => {
    const { user_id, points, category, remarks, event_id } = req.body;
    const assignerId = req.user?.id;
    const assignerRole = req.user?.role;

    const isUUID = (str: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(str);
    };
    const finalAssignerId = assignerId && isUUID(assignerId) ? assignerId : '2690965e-c8f9-496a-ac07-690f86ad9937';

    // 1. Validation Layer
    if (!user_id || points === undefined || !category || !remarks) {
        res.status(400).json({ error: 'SYSTEM_HALT: Missing required point configuration parameters.' });
        return;
    }

    if (!VALID_CATEGORIES.includes(category)) {
        res.status(400).json({ error: `SYSTEM_HALT: Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
        return;
    }

    // Mandatory remarks for policy violation / negative points
    if (points < 0 && category !== 'Policy Violation') {
        res.status(400).json({ error: 'SYSTEM_HALT: Deductions must fall under the "Policy Violation" category.' });
        return;
    }

    // 2. Authorization Boundaries
    // "Faculty Coordinator and Student Coordinator can assign appreciation points post-event."
    const isAuthorized = ['Super Admin', 'Club Coordinator', 'Faculty Coordinator'].includes(assignerRole || '');
    if (!isAuthorized) {
        res.status(403).json({ error: 'SYSTEM_HALT: Privilege validation failed. Point management requires Coordinator privileges.' });
        return;
    }

    try {
        // Confirm target user exists
        const userCheck = await dbPool.query('SELECT id FROM users WHERE id = $1 LIMIT 1', [user_id]);
        if (userCheck.rows.length === 0) {
            res.status(404).json({ error: 'Target user not found.' });
            return;
        }

        // Write points transaction
        const insertQuery = `
            INSERT INTO appreciation_points (user_id, points, category, remarks, event_id, assigned_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const result = await dbPool.query(insertQuery, [
            user_id,
            points,
            category,
            remarks,
            event_id || null,
            finalAssignerId
        ]);

        res.status(201).json({
            message: 'Points transaction successfully logged.',
            transaction: result.rows[0]
        });

    } catch (err) {
        console.error('Error assigning points:', err);
        res.status(500).json({ error: 'SYSTEM_HALT: Database execution exception.' });
    }
};

// Endpoint: Contribution Leaderboard
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.full_name, 
                u.student_id, 
                r.role_name,
                COALESCE(SUM(ap.points), 0) as total_points
            FROM users u
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN appreciation_points ap ON u.id = ap.user_id
            WHERE u.account_status = 'ACTIVE'
            GROUP BY u.id, u.full_name, u.student_id, r.role_name
            ORDER BY total_points DESC;
        `;
        const result = await dbPool.query(query);

        // Dynamically compute badges based on point totals
        const leaderboard = result.rows.map(row => {
            const points = parseInt(row.total_points, 10);
            return {
                id: row.id,
                full_name: row.full_name,
                student_id: row.student_id,
                role: row.role_name,
                total_points: points,
                badges: getBadgesForPoints(points)
            };
        });

        res.status(200).json({ leaderboard });
    } catch (err) {
        console.error('Error loading leaderboard:', err);
        res.status(500).json({ error: 'SYSTEM_HALT: Database query error.' });
    }
};

// Endpoint: Single Member Recognition Dashboard
export const getMemberPointsDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    const targetUserId = req.params.userId || req.user?.id;

    if (!targetUserId) {
        res.status(400).json({ error: 'SYSTEM_HALT: Missing target user identifier.' });
        return;
    }

    try {
        // 1. Fetch user summary details
        const userQuery = `
            SELECT u.id, u.full_name, u.student_id, r.role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = $1 LIMIT 1;
        `;
        const userResult = await dbPool.query(userQuery, [targetUserId]);
        if (userResult.rows.length === 0) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        // 2. Fetch point history log
        const historyQuery = `
            SELECT 
                ap.id, 
                ap.points, 
                ap.category, 
                ap.remarks, 
                ap.created_at, 
                e.title as event_title,
                u.full_name as assigned_by_name
            FROM appreciation_points ap
            LEFT JOIN events e ON ap.event_id = e.id
            LEFT JOIN users u ON ap.assigned_by = u.id
            WHERE ap.user_id = $1
            ORDER BY ap.created_at DESC;
        `;
        const historyResult = await dbPool.query(historyQuery, [targetUserId]);

        // 3. Fetch count of checked-in events
        const attendanceQuery = `
            SELECT COUNT(DISTINCT event_id) as attended_count
            FROM attendance_logs
            WHERE user_id = $1 AND check_in_time IS NOT NULL;
        `;
        const attendanceResult = await dbPool.query(attendanceQuery, [targetUserId]);

        // 4. Fetch full event participation logs (checked-in events)
        const participationQuery = `
            SELECT 
                al.id,
                al.event_id,
                e.title as event_title,
                e.event_date,
                al.check_in_time,
                al.check_out_time,
                al.status
            FROM attendance_logs al
            JOIN events e ON al.event_id = e.id
            WHERE al.user_id = $1
            ORDER BY e.event_date DESC;
        `;
        const participationResult = await dbPool.query(participationQuery, [targetUserId]);

        // Aggregate point balance
        const totalPoints = historyResult.rows.reduce((sum, row) => sum + row.points, 0);

        res.status(200).json({
            user: userResult.rows[0],
            total_points: totalPoints,
            badges: getBadgesForPoints(totalPoints),
            attendance_count: parseInt(attendanceResult.rows[0].attended_count || '0', 10),
            history: historyResult.rows,
            participation_log: participationResult.rows
        });

    } catch (err) {
        console.error('Points dashboard retrieval failure:', err);
        res.status(500).json({ error: 'SYSTEM_HALT: Database aggregation exception.' });
    }
};

// Endpoint: Semester/Annual Recognition Report Export (CSV Format)
export const exportRecognitionReport = async (req: AuthRequest, res: Response): Promise<void> => {
    const userRole = req.user?.role;
    const isCoord = ['Super Admin', 'Club Coordinator', 'Faculty Coordinator'].includes(userRole || '');

    if (!isCoord) {
        res.status(403).json({ error: 'SYSTEM_HALT: Privilege validation failed.' });
        return;
    }

    try {
        const query = `
            SELECT 
                u.student_id, 
                u.full_name, 
                u.email,
                COALESCE(SUM(ap.points), 0) as total_points
            FROM users u
            LEFT JOIN appreciation_points ap ON u.id = ap.user_id
            GROUP BY u.id, u.student_id, u.full_name, u.email
            ORDER BY total_points DESC;
        `;
        const result = await dbPool.query(query);

        let csvContent = 'Student ID,Full Name,Email,Total Points,Badges\n';
        result.rows.forEach(row => {
            const points = parseInt(row.total_points, 10);
            const badges = getBadgesForPoints(points).join(' | ');
            csvContent += `"${row.student_id || ''}","${row.full_name}","${row.email}",${points},"${badges}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=cyberkavach_points_report.csv');
        res.status(200).send(csvContent);

    } catch (err) {
        res.status(500).json({ error: 'Export failed.' });
    }
};
