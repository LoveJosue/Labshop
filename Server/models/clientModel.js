import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const clientSchema = new Schema({
    name: String,
    prename: String,
    phone: String,
    email: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    dateCreation: { type: Date, default: Date.now }
});

const Client = model('client', clientSchema);
export default Client;