import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: String,
    prename: String,
    phone: String,
    email: { type: String, unique: true, required: true },
    password: String,
    signUpDate: { type: Date, default: Date.now },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" } // lien optionnel
});

const User = model('order', userSchema);
export default User;