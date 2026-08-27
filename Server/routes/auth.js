import express from 'express';
import rateLimit from 'express-rate-limit'
import * as authController from '../controllers/authController.js';
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Trop de tentatives, réessayez plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', optionalAuth, authController.logout);
router.get('/me', optionalAuth, authController.me);

export default router;
