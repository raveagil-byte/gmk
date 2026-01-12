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

import { sendEmail } from '../services/emailService';

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findByEmail(email);

        if (!user) {
            // Security: Don't reveal if user exists
            res.status(200).json({ message: 'If email exists, reset link sent.' });
            return;
        }

        // Generate temporary token (in real app, save to DB with expiry)
        const resetToken = jwt.sign({ id: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '15m' });
        const resetLink = `https://gmk-logistics.vercel.app/reset-password?token=${resetToken}`;

        const emailContent = `
            <h3>Permintaan Reset Password - GMK Logistics</h3>
            <p>Halo ${user.name},</p>
            <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
            <p>Silakan klik link di bawah ini untuk membuat password baru:</p>
            <a href="${resetLink}" style="background:#EE4D2D; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Reset Password</a>
            <p>Link ini berlaku selama 15 menit.</p>
            <p>Jika Anda tidak merasa meminta ini, abaikan saja email ini.</p>
        `;

        await sendEmail(email, 'Reset Password GMK', emailContent);

        res.json({ message: 'If email exists, reset link sent.' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
