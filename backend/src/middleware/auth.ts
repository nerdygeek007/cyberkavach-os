// backend/src/middleware/auth.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        clearance: number;
        account_status: string;
    };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'SYSTEM_HALT: Missing or malformed access token' });
        return;
    }

    const token = authHeader.split(' ')[1]!;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as AuthRequest['user'];
        
        if (decoded?.account_status !== 'ACTIVE') {
            res.status(403).json({ error: 'SYSTEM_HALT: Account status is not active.' });
            return;
        }

        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ error: 'SYSTEM_HALT: Token signature invalid or expired' });
        return;
    }
};

// Enforce role clearance based on explicit string names
// Passing ['Super Admin', 'Club Coordinator'] creates an absolute access boundary
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'SYSTEM_HALT: Unauthenticated request block' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'SYSTEM_HALT: Privilege escalation block. Insufficient permissions.' });
            return;
        }

        next();
    };
};