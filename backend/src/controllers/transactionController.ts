import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { TransactionModel } from '../models/transactionModel';

export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { itemCount, notes } = req.body;

        if (!req.user) return res.sendStatus(401);
        if (!itemCount || itemCount <= 0) {
            res.status(400).json({ message: 'Item count must be greater than 0' });
            return;
        }

        const tx = await TransactionModel.create(req.user.id, parseInt(itemCount), notes);
        res.status(201).json({ success: true, data: tx });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.sendStatus(401);

        const filters: any = {};

        // If courier, force filter by their ID
        // If Admin/Supervisor, allow them to filter specifically, otherwise show all
        if (req.user.role === 'COURIER') {
            filters.courierId = req.user.id;
        } else if (req.query.courierId) {
            filters.courierId = req.query.courierId as string;
        }

        const transactions = await TransactionModel.findAll(filters);
        res.json({ success: true, count: transactions.length, data: transactions });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const verifyTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.user) return res.sendStatus(401);

        // Business Rule: Couriers cannot verify
        if (req.user.role === 'COURIER') {
            res.status(403).json({ message: 'Unauthorized review' });
            return;
        }

        const tx = await TransactionModel.verify(id as string, req.user.id);
        if (!tx) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        res.json({ success: true, data: tx });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!req.user) return res.sendStatus(401);
        const user = req.user;

        // Business Rule: Only Admin can delete
        if (user.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only Admin can delete' });
            return;
        }

        const tx = await TransactionModel.softDelete(id as string, user.id);
        if (!tx) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        res.json({ message: 'Transaction deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
