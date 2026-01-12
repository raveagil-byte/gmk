import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1)
    })
});

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(5),
        name: z.string().min(3),
        role: z.enum(['ADMIN', 'SUPERVISOR', 'COURIER'])
    })
});

export const createTransactionSchema = z.object({
    body: z.object({
        itemCount: z.number().int().positive({ message: "Item count must be > 0" }),
        notes: z.string().optional()
    })
});

export const idParamSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    })
});
