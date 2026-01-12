import { query } from '../db';

export const AuditModel = {
    async create(data: {
        userId: string;
        action: string;
        entityType: string;
        entityId: string;
        oldValues?: any;
        newValues?: any;
        ipAddress?: string;
    }) {
        await query(
            `INSERT INTO audit_logs 
            (user_id, action, entity_type, entity_id, old_values, new_values, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                data.userId,
                data.action,
                data.entityType,
                data.entityId,
                JSON.stringify(data.oldValues || {}),
                JSON.stringify(data.newValues || {}),
                data.ipAddress || '0.0.0.0'
            ]
        );
    },

    async findAll() {
        const res = await query(
            `SELECT a.*, u.name as user_name, u.email as user_email
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 100`
        );
        return res.rows;
    }
};
