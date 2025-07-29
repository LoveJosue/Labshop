import mongoose from 'mongoose';
const  { Schema, model } = mongoose;

const productSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    material: {
        type: String,
        required: false
    },
    capacity: {
        volume: Number,
        unit: String
    },
    unitType: {
        type: String,
        lowercase: true
    },
    qtyPerUnit: Number,
    unitPerBox: Number,
    category: String,
    imgsUrl: [String],
    priceList: [{
        name: {
            type: String,
            lowercase: true
        },
        unitPrice: Number,
        best: Boolean
    }],
    infos: [{
        infoType: Number,
        title: String,
        content: String,
        subInfos: [{
            title: String,
            content: String,
            detailedContent: {
                capacity: {
                    volume: Number,
                    unit: String
                },
                packaging: String,
                dimensions: {
                    length: Number,
                    width: Number,
                    height: Number,
                    unit: String
                }
            }
        }]
    }],
    stock: {
        totalUnits: Number,
        wholesaleReserve: Number,
        retailReserve: Number
    },
    dateAdded: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    }
});

const Product = model('product', productSchema);
export default Product;