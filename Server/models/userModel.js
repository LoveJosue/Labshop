import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const BCRYPT_COST = 12;

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email:    { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ['client', 'admin'], default: 'client' },
    clientId: { type: Schema.Types.ObjectId, ref: 'client', required: true },
    signUpDate: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, BCRYPT_COST);
    next();
});

userSchema.methods.comparePassword = function(candidate) {
    return bcrypt.compare(candidate, this.password);
};

const User = model('user', userSchema);
export default User;