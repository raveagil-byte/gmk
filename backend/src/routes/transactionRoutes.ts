import { Router } from 'express';
import {
    createTransaction,
    getTransactions,
    verifyTransaction,
    deleteTransaction
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createTransactionSchema, idParamSchema } from '../schemas';

const router = Router();

router.use(authenticateToken); // Protect all routes

router.post('/', validate(createTransactionSchema), createTransaction);
router.get('/', getTransactions);
router.put('/:id/verify', validate(idParamSchema), verifyTransaction);
router.delete('/:id', validate(idParamSchema), deleteTransaction);

export default router;
