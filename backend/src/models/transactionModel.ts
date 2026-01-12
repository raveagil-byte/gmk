import { query } from '../db';

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
        return res.rows[0];
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
        const res = await query(
            `UPDATE transactions 
       SET status = 'VERIFIED', verified_by_id = $2, verified_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
            [id, verifierId]
        );
        return res.rows[0];
    },

    async softDelete(id: string) {
        const res = await query(
            `UPDATE transactions 
       SET deleted_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
            [id]
        );
        return res.rows[0];
    }
};
