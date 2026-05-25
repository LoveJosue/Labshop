import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;

const BCRYPT_COST = 12;

const userSchema = new Schema({
    email:    { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // jamais renvoyé par défaut
    role:     { type: String, enum: ['client', 'admin'], default: 'client' },
    clientId: { type: Schema.Types.ObjectId, ref: 'client', required: true },
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },
    signUpDate: { type: Date, default: Date.now }
});

// Hachage automatique avant sauvegarde
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, BCRYPT_COST);
    next();
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

const User = model('user', userSchema);
export default User;