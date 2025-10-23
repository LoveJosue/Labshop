import mongoose from 'mongoose';
import crypto from "crypto";

const { Schema, model } = mongoose;

const itemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    imgUrl: String,
    purchaseType: { type: Number, required: true }, // 1 = gros = boîte, 2 = détail = palette, etc.
    qte: { type: Number, required: true },
    unitPerBox: Number, // optionnel, dépend du type d'achat
    unitType: String,   // ex: 'palette', 'boîte
    unitPrice: { type: Number, required: true },
    cost: { type: Number, required: true },
    productUrl: String,
    itemCartId: Number // identifiant local de la ligne (utile côté frontend)
});

const orderSchema = new Schema({
    orderNumber: {
        type: String,
        unique: true,
        default: () => {
            const date = new Date().toISOString().slice(0,10).replace(/-/g,"");
            const id = crypto.randomBytes(3).toString("hex").toUpperCase();
            return `CMD-${date}-${id}`;
        }
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    clientInfos: {
        name: String,
        prename: String,
        phone: String,
        email: String
    },
    orderDate: { type: Date, default: Date.now },
    statut: { type: String, enum: ["en attente", "payée", "expédiée", "livrée", "annulée"], default: "en attente" },
    payment: {
        cardNumber: String,
        cardOwner: String,
        cardCvv: String,
        cardExpiration: String
    },
    items: [itemSchema],
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