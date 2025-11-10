import  { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createORUpdate, getOrderById, getOrderByUser } from "../controllers/orderController";

export const orderRouter = Router();

orderRouter.post("/" , authMiddleware, createORUpdate);
orderRouter.get("/", authMiddleware, getOrderByUser )
orderRouter.get("/:id", authMiddleware, getOrderById)
