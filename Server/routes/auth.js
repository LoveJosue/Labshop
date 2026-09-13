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

// L'endpoint déclenche un envoi de courriel vers une adresse fournie par
// l'appelant : sans plafond serré, il sert de relais de spam et permet de
// marteler la boîte d'un client. Plus strict que le login, volontairement.
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Trop de demandes de réinitialisation, réessayez plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Le jeton fait 256 bits, il n'est pas devinable ; ce plafond ne sert qu'à
// éviter qu'on martèle l'endpoint (vérification faite à chaque ouverture de page).
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Trop de tentatives, réessayez plus tard.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);
router.post('/reset-password/verify', resetPasswordLimiter, authController.verifyResetToken);
router.post('/reset-password', resetPasswordLimiter, authController.resetPassword);
router.post('/logout', optionalAuth, authController.logout);
router.get('/me', optionalAuth, authController.me);

export default router;
