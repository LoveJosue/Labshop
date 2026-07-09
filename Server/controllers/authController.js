import User from '../models/userModel.js';
import Client from '../models/clientModel.js';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, COOKIE_OPTIONS } from '../middleware/auth.js';

const GENERIC_AUTH_ERROR = 'Email ou mot de passe incorrect.';

function signToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

// Forme publique sûre - pas de données sensibles ni de tokens.
function publicUser(user) {
    const client = user.clientId;
    return {
        id:      user._id,
        email:   user.email,
        role:    user.role,
        name:    client?.name ?? null,
        prename: client?.prename ?? null,
        phone:   client?.phone ?? null,
    };
}

// POST /api/auth/login
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error:  GENERIC_AUTH_ERROR });
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password').populate('clientId');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error : GENERIC_AUTH_ERROR });
        }
        res.cookie(COOKIE_NAME, signToken(user), COOKIE_OPTIONS)
        return res.json({ user: publicUser(user) });
    } catch(error) {
        next(error);
    }
}

// POST /api/auth/register
export async function register(req, res, next) {
    try {
        const { email, password, name, prename, phone } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis!' });
        if (password.length < 8) {
            return res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        
        // Si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email:  normalizedEmail});
        if (existingUser) {
            return res.status(409).json({ error: "Un compte existe déjà pour cet email." });
        }

        // Si la personne a déjà commandé en invité, on récupère son Client existant
        let client = await Client.findOne({ email: normalizedEmail });
        if (!client) {
            client = await Client.create({ name, prename, phone, email: normalizedEmail });
        }
        const user = await User.create({ 
            email : normalizedEmail,
            password, 
            role: 'client', 
            clientId : client._id, 
        });
        
        client.userId = user._id;
        await client.save();
        await user.populate('clientId');
        return res.status(201).json({ user: publicUser(user) });
    } catch(error) {
        next(error);
    }
}

// POST /api/auth/logout
export function logout(_req, res) {
    res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTIONS, maxAge: undefined });
    return res.json({ ok: true });
}

// GET /api/auth/me
export function me(req, res) {
    if (!req.user) return res.json({ user: null });
    return res.json({ user: publicUser(req.user) });
}