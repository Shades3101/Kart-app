import mongoose, { Schema } from "mongoose";


export const orderItemSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref : 'Product', required: true},
    quantity: {type: Number, required: true},
})

export const orderSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, ref:"product", required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    items: [orderItemSchema],
    totalAmount: {type: Number},
    shippingAddress: {type: Schema.Types.ObjectId, ref: "Address"},
    paymentStatus: {type: String, enum: ["pending", "complete", "failed"], default: "pending" },
    paymentMethod: {type: String},
    paymentDetails: {
        razorpay_order_id: {type: String},
        razorpay_payment_id: {type: String},
        razorpay_signature: {type: String}
    },
    status: {type: String, enum: ["processing", "shipped", "delivered", "cancelled"], default:null}
}, {timestamps: true})

export const OrderModel = mongoose.model("Order", orderSchema)