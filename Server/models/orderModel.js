import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    clientInfos: {
        name: String,
        prename: String,
        phone: String,
        email: String
    }
    orderDate: { type: Date, default: Date.now },
    statut: { type: String, enum: ["en attente", "payée", "expédiée", "livrée", "annulée"], default: "en attente" },
    payment: {
        cardNumber: String,
        cardOwner: String,
        cardCvv: String,
        cardExpiration: String
    },
    // items: [];
    subTotal : Number,
    expeditionCosts: Number,
    tva: Number,
    totalWithTVA: Number,
    billing: {
        location: {
            latitude: String,
            longitude: String
        },
        address: String,
        country: String,
        city: String,
        postalCode: String,
        name: String,
        prename: String,
        phone: String,
    },
    expedition: {
        location: {
            latitude: String,
            longitude: String
        },
        address: String,
        country: String,
        city: String,
        postalCode: String,
        name: String,
        prename: String,
        phone: String,
    },
    pickup: {
        storeName: String,
        address: String,
        location: {
            latitude: Number,
            longitude: Number
        }
    }

})

const Order = model('order', orderSchema);
export default Order;