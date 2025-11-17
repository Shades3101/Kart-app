import mongoose, { Schema } from "mongoose";


const wishListSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required:true},
    products: [{type: Schema.Types.ObjectId, ref: "Product" }]

}, {timestamps: true})

export const wishListModel = mongoose.model("WishList", wishListSchema )