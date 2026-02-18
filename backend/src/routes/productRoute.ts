import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudinaryConfig";
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductBySeller } from "../controllers/productController";


export const productRouter = Router();

productRouter.post("/", authMiddleware, multerMiddleware, createProduct);
productRouter.get("/", getAllProducts)
productRouter.get("/:id", authMiddleware, getProductById)
productRouter.delete("/seller/:productId", authMiddleware, deleteProduct);
productRouter.get("/seller/:sellerId", authMiddleware, getProductBySeller)