import { Request, Response } from "express";
import { cartModel } from "../models/CartItems";
import { OrderModel } from "../models/Order";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import { response } from "../utils/responseHandler";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string
})

export const createORUpdate = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        // Get orderId from params (for PATCH) or body (for POST)
        const orderId = req.params.id || req.body.orderId;
        const { shippingAddress, paymentMethod, paymentDetails, totalAmount, paymentStatus, status } = req.body;

        let order = await OrderModel.findOne({ _id: orderId, user: userId });

        if (order) {
            // Update existing order
            if (shippingAddress) order.shippingAddress = shippingAddress;
            if (paymentMethod) order.paymentMethod = paymentMethod;
            if (totalAmount) order.totalAmount = totalAmount;
            if (paymentStatus) order.paymentStatus = paymentStatus;
            if (status) order.status = status;
            
            if (paymentDetails) {
                order.paymentDetails = paymentDetails;
                order.paymentStatus = "complete";
                order.status = "processing";
            }

            await order.save();

            // Clear cart after successful payment
            if (order.paymentStatus === "complete") {
                await cartModel.findOneAndUpdate(
                    { user: userId },
                    { $set: { items: [] } }
                );
            }

            return response(res, 200, "Order Updated Successfully", order);
        } else {
            // Create new order - cart is required
            const cart = await cartModel.findOne({ user: userId }).populate("items.product");

            if (!cart || cart.items.length === 0) {
                return response(res, 400, "Cart is Empty");
            }

            order = await OrderModel.create({
                user: userId,
                items: cart.items,
                totalAmount,
                shippingAddress,
                paymentMethod,
                paymentStatus: "pending",
                status: null  // Will be set to "processing" after payment
            });

            return response(res, 200, "Order Created Successfully", order);
        }
        
    } catch (error) {
        console.error("Order creation/update error:", error);
        return response(res, 500, "Internal Server Error");
    }
}

export const getOrderByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const order = await OrderModel.find({ user: userId }).sort({ createdAt: -1 }).populate("user", "name email").populate("shippingAddress").populate({
            path: "items.product",
            model: "Product"
        })
        if (!order) {

            return response(res, 404, "Order not found")
        }

        return response(res, 200, "User Order Fetched SuccessFully", order)

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await OrderModel.findById(req.params.id).populate("user", "name email").populate("shippingAddress").populate({
            path: "items.product",
            model: "Product"
        })

        if (!order) {

            return response(res, 404,"Order not found")
        }

        return response(res, 200, "Order Fetched SuccessFully", order)

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;
        const order = await OrderModel.findById(orderId);

        if (!order) {

            return response(res, 404, "Order not Found")
        }
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount! * 100),
            currency: "INR",
            receipt: order._id.toString()
        })

        return response(res, 200,  "Payment Created Successfully", {order: razorpayOrder})

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const handleRazorPayWebHook = async (req: Request, res: Response) => {

    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
        const shasum = crypto.createHmac('sha256', secret)
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest === req.headers['x-razorpay-signature']) {
            const paymentId = req.body.payload.payment.entity.id;
            const orderId = req.body.payload.payment.entity.order.id;

            await OrderModel.findOneAndUpdate(
                { "paymentDetails.razorpay_order_id": orderId },
                {
                    paymentStatus: "completed",
                    status: "processing",
                    "paymentDetails.razorpay_payment_id": paymentId
                }
            )

            return response(res, 200, "Webhook Processed Successfully")
        } else {

            return response(res, 400, "Invalid Signature")
        }
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }

}
