import { query } from '../db';
import { AuditModel } from './auditModel';

export interface Transaction {
    id: string;
    courier_id: string;
    item_count: number;
    price_per_item: number;
    total_value: number;
    notes?: string;
    status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED';
    verified_by_id?: string;
    verified_at?: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    // Joins
    courier_name?: string;
    verifier_name?: string;
}

export const TransactionModel = {
    async create(courierId: string, itemCount: number, notes?: string) {
        const PRICE = 3000;
        const totalValue = itemCount * PRICE;

        const res = await query(
            `INSERT INTO transactions 
       (courier_id, item_count, price_per_item, total_value, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'DRAFT')
       RETURNING *`,
            [courierId, itemCount, PRICE, totalValue, notes]
        );
        const tx = res.rows[0];

        // Audit
        await AuditModel.create({
            userId: courierId,
            action: 'CREATE_TRANSACTION',
            entityType: 'TRANSACTION',
            entityId: tx.id,
            newValues: tx
        });

        return tx;
    },

    async findAll(filters: { courierId?: string; startDate?: string; endDate?: string }) {
        let sql = `
      SELECT t.*, u.name as courier_name, v.name as verifier_name 
      FROM transactions t
      JOIN users u ON t.courier_id = u.id
      LEFT JOIN users v ON t.verified_by_id = v.id
      WHERE t.deleted_at IS NULL
    `;
        const params: any[] = [];
        let idx = 1;

        if (filters.courierId) {
            sql += ` AND t.courier_id = $${idx++}`;
            params.push(filters.courierId);
        }

        // Add sorting
        sql += ` ORDER BY t.created_at DESC`;

        const res = await query(sql, params);
        return res.rows;
    },

    async findById(id: string) {
        const res = await query(
            `SELECT t.*, u.name as courier_name 
       FROM transactions t
       JOIN users u ON t.courier_id = u.id
       WHERE t.id = $1 AND t.deleted_at IS NULL`,
            [id]
        );
        return res.rows[0];
    },

    async verify(id: string, verifierId: string) {
        const oldTx = await this.findById(id);

        const res = await query(
            `UPDATE transactions 
       SET status = 'VERIFIED', verified_by_id = $2, verified_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
            [id, verifierId]
        );
        const newTx = res.rows[0];

        // Audit
        await AuditModel.create({
            userId: verifierId,
            action: 'VERIFY_TRANSACTION',
            entityType: 'TRANSACTION',
            entityId: id,
            oldValues: oldTx,
            newValues: newTx
        });

        return newTx;
    },

    async softDelete(id: string, userId: string) {
        const oldTx = await this.findById(id);

        const res = await query(
            `UPDATE transactions 
       SET deleted_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
            [id]
        );

        // Audit
        await AuditModel.create({
            userId: userId,
            action: 'DELETE_TRANSACTION',
            entityType: 'TRANSACTION',
            entityId: id,
            oldValues: oldTx,
            newValues: { deleted_at: 'NOW()' }
        });

        return res.rows[0];
    }
};
