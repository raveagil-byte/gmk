import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        name: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.sendStatus(403);
            return;
        }
        next();
    };
};
