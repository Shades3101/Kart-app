import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addToWishList, getWishList, removeFromWishList } from "../controllers/wisthListController";

export const wishListRouter = Router();

wishListRouter.post("/add", authMiddleware, addToWishList);
wishListRouter.delete("/remove/:productId", authMiddleware, removeFromWishList);
wishListRouter.get("/:userId", authMiddleware, getWishList)