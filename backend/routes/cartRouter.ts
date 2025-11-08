import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController";

export const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.delete("/remove/:productId", authMiddleware, removeFromCart);
cartRouter.get("/:userId", authMiddleware, getCart)