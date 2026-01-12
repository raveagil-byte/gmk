import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AuditModel } from '../models/auditModel';

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
    try {
        // Only Admin can see audit logs
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }

        const logs = await AuditModel.findAll();
        res.json({ success: true, count: logs.length, data: logs });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
