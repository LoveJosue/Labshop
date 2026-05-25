import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const COOKIE_NAME = 'labstore_token';

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
};

function readToken(req) {
    return req.cookies?.[COOKIE_NAME] || null;
}

// Renseigne req.user s'il existe, sinon laisse passer en anonyme.
export async function optionalAuth(req, _res, next) {
    const token = readToken(req);
    if (!token) return next();
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub).populate('clientId');
        if (user) req.user = user;
    } catch {
        // Token invalide ou expiré → on reste anonyme
    }
    next();
}

// Bloque si pas connecté.
export async function requireAuth(req, res, next) {
    const token = readToken(req);
    if (!token) return res.status(401).json({ error: 'Authentification requise.' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub).populate('clientId');
        if (!user) return res.status(401).json({ error: 'Session invalide.' });
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ error: 'Session invalide.' });
    }
}

// À utiliser plus tard pour les endpoints d'admin.
export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès réservé.' });
    }
    next();
}