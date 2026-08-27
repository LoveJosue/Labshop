import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const COOKIE_NAME = 'labstore_token';

const isProd = process.env.NODE_ENV === 'production';

// Le front (www.labstore.ca) et l'API (api.labstore.ca) partagent le même domaine
// enregistrable : le cookie est first-party, donc 'lax' suffit. Surtout, on évite
// 'none', qui fait du cookie un cookie tiers — bloqué par défaut par Safari (ITP).
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd, // en local le front est en http://, où Secure n'est pas fiable
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
        if (user && payload.ver === user.tokenVersion) req.user = user;
    } catch {
        // Token invalide ou expiré. On reste anonyme.
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
        if (!user || payload.ver !== user.tokenVersion) {
            return res.status(401).json({ error: 'Session invalide.' });
        }
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ error: 'Session invalide.' });
    }
}

// Utiliser pour endpoints Admin (à chaîner après requireAuth)
export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès réservé.' });
    }
    next();
}