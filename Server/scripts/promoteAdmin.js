// Usage: node scripts/promoteAdmin.js <email>
// Promeut un utilisateur existant au rôle 'admin'.

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/userModel.js';

const email = process.argv[2];
if (!email) {
    console.error('Usage: node scripts/promoteAdmin.js <email>');
    process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
const result = await User.updateOne(
    { email: email.toLowerCase().trim() },
    { $set: { role: 'admin' } }
);
console.log(result.modifiedCount
    ? `✓ ${email} promu admin`
    : `✗ Aucun utilisateur trouvé pour ${email}`);
await mongoose.disconnect();