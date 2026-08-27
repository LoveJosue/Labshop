import User from '../models/userModel.js';
import Client from '../models/clientModel.js';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, COOKIE_OPTIONS } from '../middleware/auth.js';

const GENERIC_AUTH_ERROR = 'Email ou mot de passe incorrect.';

// Exige un domaine complet avec TLD — doit refléter la modale d'inscription (AuthModal.vue).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Téléphone optionnel mais, si fourni, format souple : chiffres, espaces, +, -, () ; 8 à 15 chiffres.
// Doit refléter la modale d'inscription (AuthModal.vue).
const PHONE_ALLOWED_REGEX = /^[\d\s+().-]+$/;
function isPhoneAcceptable(raw) {
    const v = String(raw ?? '').trim();
    if (!v) return true; // optionnel
    if (!PHONE_ALLOWED_REGEX.test(v)) return false;
    const digits = (v.match(/\d/g) || []).length;
    return digits >= 8 && digits <= 15;
}

// Règles de mot de passe — doivent refléter la modale d'inscription (AuthModal.vue).
function validatePassword(password) {
    if (typeof password !== 'string' || password.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir au moins une lettre majuscule.';
    if (!/[a-z]/.test(password)) return 'Le mot de passe doit contenir au moins une lettre minuscule.';
    if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre.';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un caractère spécial.';
    return null;
}

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

// Valide le payload d'inscription. Retourne un message d'erreur (français) ou null si tout est valide.
// Les règles doivent refléter la modale d'inscription (AuthModal.vue).
function validateRegistration({ email, password, name, prename, phone }) {
    if (!email || !password)                         return 'Email et mot de passe requis!';
    if (!isNonEmptyString(name) || !isNonEmptyString(prename)) return 'Le nom et le prénom sont requis.';
    if (!EMAIL_REGEX.test(String(email).trim()))     return 'Veuillez saisir une adresse e-mail valide.';
    if (!isPhoneAcceptable(phone))                   return 'Veuillez saisir un numéro de téléphone valide.';
    return validatePassword(password);
}

function signToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), role: user.role, ver: user.tokenVersion },
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

        const validationError = validateRegistration(req.body);
        if (validationError) return res.status(400).json({ error: validationError });

        const normalizedEmail = email.toLowerCase().trim();
        
        // Si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email:  normalizedEmail});
        if (existingUser) {
            return res.status(409).json({ error: "Un compte existe déjà pour cet email." });
        }

        // Si la personne a déjà commandé en invité, on récupère son Client existant
        let client = await Client.findOne({ email: normalizedEmail });
        if (!client) {
            client = await Client.create({ name: name.trim(), prename: prename.trim(), phone: phone?.trim(), email: normalizedEmail });
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
export async function logout(req, res, next) {
    try {
        // Si on connaît l'utilisateur, on révoque tous ses tokens en base.
        if (req.user) {
            await User.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
        }
        res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTIONS, maxAge: undefined });
        return res.json({ ok: true });
    } catch (error) {
        next(error);
    }
}

// GET /api/auth/me
export function me(req, res) {
    if (!req.user) return res.json({ user: null });
    return res.json({ user: publicUser(req.user) });
}