import { Router } from 'express';
import { login, register, forgotPassword } from '../controllers/authController';
import { validate } from '../middleware/validationMiddleware';
import { loginSchema, registerSchema } from '../schemas';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);

export default router;
