import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role } = req.body;

        // Validate role
        if (!['ADMIN', 'SUPERVISOR', 'COURIER'].includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

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

        res.status(201).json({ message: 'User created', userId: newUser.id });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
