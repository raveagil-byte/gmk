import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';

// Routes
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Logging
app.use(morgan('tiny'));

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('KurirTrack API is running');
});

app.use('/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Global Error Handler (Must be last)
app.use(errorHandler);

export default app;
