import  { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createORUpdate, createPayment, getOrderById, getOrderByUser, handleRazorPayWebHook } from "../controllers/orderController";

export const orderRouter = Router();

orderRouter.post("/" , authMiddleware, createORUpdate);
orderRouter.get("/", authMiddleware, getOrderByUser )
orderRouter.get("/:id", authMiddleware, getOrderById)
orderRouter.post("/payment-razorpay", authMiddleware, createPayment);
orderRouter.post("/razorpay-webhook", authMiddleware, handleRazorPayWebHook)