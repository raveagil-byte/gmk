import axios from 'axios';
import { User, Transaction, AuditLog } from '../types';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async login(email: string) {
        // For demo/dev simplicity, assuming password same as part of email or hardcoded
        // In real app, password should be prompted
        let password = 'password';
        if (email.includes('admin')) password = 'admin';

        // Auto-register logic for demo if user not found (optional, or just handle Login failure)
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            return res.data.user;
        } catch (e) {
            // Fallback try to register if it's a courier demo
            // This is purely for smoother UX in this specific demo environment
            if (email.includes('courier') || email.includes('budi') || email.includes('andi')) {
                const name = email.split('@')[0];
                try {
                    await api.post('/auth/register', {
                        email,
                        password: 'password',
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        role: email.includes('admin') ? 'ADMIN' : (email.includes('budi') ? 'SUPERVISOR' : 'COURIER')
                    });
                    const res = await api.post('/auth/login', { email, password: 'password' });
                    localStorage.setItem('token', res.data.token);
                    return res.data.user;
                } catch (regError) {
                    throw regError;
                }
            }
            throw e;
        }
    },

    logout() {
        localStorage.removeItem('token');
    }
};

export const transactionService = {
    async getAll() {
        const res = await api.get('/api/transactions');
        return res.data.data.map((tx: any) => ({
            ...tx,
            courierName: tx.courier_name, // Map backend snake_case to frontend camelCase if needed
            createdAt: tx.created_at,
            itemCount: tx.item_count,
            totalValue: tx.total_value
        }));
    },

    async create(itemCount: number, notes?: string) {
        const res = await api.post('/api/transactions', { itemCount, notes });
        return res.data.data;
    },

    async verify(id: string) {
        const res = await api.put(`/api/transactions/${id}/verify`);
        return res.data.data;
    },

    async delete(id: string) {
        const res = await api.delete(`/api/transactions/${id}`);
        return res.data;
    }
};
