// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { dbPool } from '../db';
// Add this import at the top of backend/src/controllers/auth.controller.ts if not present
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { student_id, full_name, email, password } = req.body;

    // 1. Input Validation Boundary
    if (!full_name || !email || !password) {
        res.status(400).json({ error: 'SYSTEM_HALT: Missing required fields.' });
        return;
    }

    try {
        // 2. Cryptographic Hashing
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Database Insertion (Parameterized to prevent SQLi)
        // Note: Defaulting to 'Club Member' role, and 'PENDING' status is handled by DB default
        const query = `
            INSERT INTO users (student_id, full_name, email, password_hash, role_id)
            VALUES (
                $1, 
                $2, 
                $3, 
                $4, 
                (SELECT id FROM roles WHERE role_name = 'Club Member' LIMIT 1)
            )
            RETURNING id, full_name, email, account_status;
        `;
        
        const values = [student_id || null, full_name, email.toLowerCase(), passwordHash];
        
        const result = await dbPool.query(query, values);
        
        res.status(201).json({
            message: 'Registration successful. Account pending coordinator approval.',
            user: result.rows[0]
        });

    } catch (error: any) {
        // Handle Postgres Unique Constraint Violation (Duplicate Email/Student ID)
        if (error.code === '23505') {
            res.status(409).json({ error: 'SYSTEM_HALT: Identity collision. Email or Student ID already exists.' });
            return;
        }
        
        console.error('[!] Registration Error:', error);
        res.status(500).json({ error: 'SYSTEM_HALT: Internal server exception.' });
    }
};

// backend/src/controllers/auth.controller.ts
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'SYSTEM_HALT: Credentials missing from request payload.' });
        return;
    }

    try {
        // Relational JOIN to extract the precise cryptographic context and role name in one operation
        const query = `
            SELECT u.id, u.full_name, u.email, u.password_hash, u.account_status, r.role_name, r.clearance_level 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.email = $1 LIMIT 1;
        `;
        const result = await dbPool.query(query, [email.toLowerCase()]);

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'SYSTEM_HALT: Invalid authentication credentials.' });
            return;
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            res.status(401).json({ error: 'SYSTEM_HALT: Invalid authentication credentials.' });
            return;
        }

        if (user.account_status !== 'ACTIVE') {
            res.status(403).json({ error: 'SYSTEM_HALT: Account status is PENDING coordinator approval.', status: user.account_status });
            return;
        }

        // Token Generation containing explicit authorization scopes and clearance mappings
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role_name,
                clearance: user.clearance_level,
                account_status: user.account_status 
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Authentication successful.',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role_name,
                clearance: user.clearance_level
            }
        });

    } catch (error) {
        console.error('[!] Login Execution Error:', error);
        res.status(500).json({ error: 'SYSTEM_HALT: Internal server exception.' });
    }
};