import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }

        const users = await UserModel.findAll();
        res.json({ success: true, count: users.length, data: users });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createUser = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }

        const { email, password, name, role } = req.body;

        const existing = await UserModel.findByEmail(email);
        if (existing) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await UserModel.create({
            email,
            name,
            password_hash: hash,
            role
        });

        res.status(201).json({ success: true, data: newUser });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
