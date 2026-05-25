import express from 'express';
import rateLimit from 'express-rate-limit';
import * as auth from '../controllers/authController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Trop de tentatives, réessayez plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', auth.register);
router.post('/login',    loginLimiter, auth.login);
router.post('/logout',   auth.logout);
router.get('/me',        optionalAuth, auth.me);

export default router;