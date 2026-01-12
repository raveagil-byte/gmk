import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.get('/', getAllUsers);
router.post('/', createUser); // Basic creation without strict validation for now

export default router;
