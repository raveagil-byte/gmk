import { query } from '../db';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    role: 'ADMIN' | 'SUPERVISOR' | 'COURIER';
}

export const UserModel = {
    async findByEmail(email: string): Promise<User | null> {
        const res = await query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0] || null;
    },

    async create(user: Omit<User, 'id'>) {
        const { email, password_hash, name, role } = user;
        const res = await query(
            `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [email, password_hash, name, role]
        );
        return res.rows[0];
    },

    async findById(id: string): Promise<User | null> {
        const res = await query('SELECT * FROM users WHERE id = $1', [id]);
        return res.rows[0] || null;
    }
};
