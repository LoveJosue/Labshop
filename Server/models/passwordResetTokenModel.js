import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// On ne stocke JAMAIS le jeton en clair : seul son SHA-256 est conservé, comme
// pour un mot de passe. Une fuite de la base ne permet donc pas de forger un
// lien de réinitialisation valide.
const passwordResetTokenSchema = new Schema({
    userId:    { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

// L'usage unique est garanti par la suppression du document dès qu'il a servi :
// un lien déjà utilisé ne correspond donc plus à aucune entrée.
// MongoDB supprime aussi tout seul les documents expirés (le moniteur TTL passe
// chaque minute). La date d'expiration est malgré tout revérifiée à chaque usage :
// le TTL est un ménage, pas un contrôle de sécurité.
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetToken = model('passwordResetToken', passwordResetTokenSchema);
export default PasswordResetToken;
