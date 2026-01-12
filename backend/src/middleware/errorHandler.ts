import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction // Must keep 4 params for Express error handler
) => {
    console.error(`[Error] ${err.message}`);

    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.issues
        });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }

    // Default 500
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};
