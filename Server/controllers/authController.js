import crypto from 'crypto';
import User from '../models/userModel.js';
import Client from '../models/clientModel.js';
import PasswordResetToken from '../models/passwordResetTokenModel.js';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, COOKIE_OPTIONS } from '../middleware/auth.js';
import { sendMail } from '../services/mailer.js';

const GENERIC_AUTH_ERROR = 'Email ou mot de passe incorrect.';

// Durée de vie volontairement courte : un lien de réinitialisation est un
// équivalent de mot de passe tant qu'il est valide.
const RESET_TOKEN_TTL_MINUTES = 10;

// Réponse unique de /forgot-password, que le compte existe ou non : sinon
// l'endpoint devient un oracle permettant d'énumérer les clients de la boutique.
const RESET_REQUEST_GENERIC_MESSAGE =
    "Si un compte est associé à cette adresse, un lien de réinitialisation vient d'être envoyé.";

const RESET_TOKEN_INVALID_MESSAGE =
    'Ce lien de réinitialisation est invalide, a déjà été utilisé ou a expiré.';

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
        res.cookie(COOKIE_NAME, signToken(user), COOKIE_OPTIONS);
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

/* ------------------------------------------------------------------ *
 *  Mot de passe oublié
 * ------------------------------------------------------------------ */

// Le jeton en clair ne vit que dans le courriel ; la base n'en garde que l'empreinte.
function hashResetToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
}

function userLocaleFrom(req) {
    return req.headers['accept-language']?.split(',')[0] || 'fr-TG';
}

// Retrouve le jeton correspondant, uniquement s'il est encore utilisable.
// Un lien déjà consommé n'a plus de document en base, d'où l'usage unique.
async function findUsableResetToken(rawToken) {
    if (typeof rawToken !== 'string' || rawToken.trim() === '') return null;
    return PasswordResetToken.findOne({
        tokenHash: hashResetToken(rawToken.trim()),
        expiresAt: { $gt: new Date() },
    });
}

// POST /api/auth/forgot-password — envoie le lien de réinitialisation.
export async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        if (!email || !EMAIL_REGEX.test(String(email).trim())) {
            return res.status(400).json({ error: 'Veuillez saisir une adresse e-mail valide.' });
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).populate('clientId');

        if (user) {
            // Un seul lien actif à la fois : redemander un lien invalide le précédent.
            await PasswordResetToken.deleteMany({ userId: user._id });

            // 256 bits d'entropie cryptographique : impossible à deviner ou à forcer.
            const rawToken = crypto.randomBytes(32).toString('base64url');
            await PasswordResetToken.create({
                userId: user._id,
                tokenHash: hashResetToken(rawToken),
                expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000),
            });

            const resetUrl = `${process.env.FRONT_END_URL}/reset-password?token=${encodeURIComponent(rawToken)}`;
            try {
                await sendMail(
                    user.email,
                    'Réinitialisation de votre mot de passe Labstore',
                    'passwordResetMail',
                    {
                        prename: user.clientId?.prename ?? '',
                        resetUrl,
                        expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
                        userLocality: userLocaleFrom(req),
                    },
                    { withBrandLogo: true }
                );
            } catch (mailErr) {
                // Journalisé côté serveur seulement : renvoyer une erreur ici
                // révélerait au demandeur que l'adresse correspond à un compte.
                console.error("Échec de l'envoi du mail de réinitialisation :", mailErr.message);
            }
        }

        return res.json({ message: RESET_REQUEST_GENERIC_MESSAGE });
    } catch (error) {
        next(error);
    }
}

// POST /api/auth/reset-password/verify — l'écran de réinitialisation vérifie le
// lien avant d'afficher le formulaire, plutôt que de le rejeter après la saisie.
// Le jeton passe par le corps de la requête : une URL finirait dans les journaux.
export async function verifyResetToken(req, res, next) {
    try {
        const resetToken = await findUsableResetToken(req.body?.token);
        return res.json({ valid: Boolean(resetToken) });
    } catch (error) {
        next(error);
    }
}

// POST /api/auth/reset-password — applique le nouveau mot de passe.
export async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;

        const resetToken = await findUsableResetToken(token);
        if (!resetToken) return res.status(400).json({ error: RESET_TOKEN_INVALID_MESSAGE });

        const passwordError = validatePassword(password);
        if (passwordError) return res.status(400).json({ error: passwordError });

        const user = await User.findById(resetToken.userId).select('+password').populate('clientId');
        if (!user) {
            await PasswordResetToken.deleteMany({ userId: resetToken.userId });
            return res.status(400).json({ error: RESET_TOKEN_INVALID_MESSAGE });
        }

        user.password = password; // haché par le hook pre('save') du modèle
        // Révoque toutes les sessions ouvertes : si un tiers avait pris la main sur
        // le compte, son cookie cesse d'être valide au moment même du changement.
        user.tokenVersion += 1;
        await user.save();

        // Usage unique : le jeton consommé disparaît, comme les autres liens en attente.
        await PasswordResetToken.deleteMany({ userId: user._id });

        // La révocation ci-dessus rend le cookie courant inutilisable : autant le retirer.
        res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTIONS, maxAge: undefined });

        try {
            await sendMail(
                user.email,
                'Votre mot de passe Labstore a été modifié',
                'passwordChangedMail',
                {
                    prename: user.clientId?.prename ?? '',
                    userLocality: userLocaleFrom(req),
                },
                { withBrandLogo: true }
            );
        } catch (mailErr) {
            // Simple avis de sécurité : son échec ne doit pas annuler un changement déjà appliqué.
            console.error("Échec de l'envoi du mail de confirmation de changement :", mailErr.message);
        }

        return res.json({ ok: true });
    } catch (error) {
        next(error);
    }
}