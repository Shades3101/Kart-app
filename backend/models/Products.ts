import mongoose, { Schema, Types } from "mongoose";

const ProductSchema = new Schema({

    title: {type: String, required: true},
    category: {type: String, required: true},
    condition : {type: String, required: true},
    classType: {type: String, required: true},
    subject: {type: String, required: true},
    images: [{type: String}],
    price : {type: Number, required: true},
    author: {type: String, required: true},
    edition: {type: String},
    description: {type: String},
    finalPrice: {type: Number, required: true},
    shippingCharge: {type: String},
    paymentMode: {type: String, enum: ['UPI', "Bank Account"], required: true},
    paymentDetails: {
        upiId : {type: String},
        bankDetails: {
            accountNumber : {type: String},
            ifscCode: {type: String},
            bankName: {type: String},

        }
    },
    seller: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true})

export const ProductModel = mongoose.model("Product", ProductSchema);