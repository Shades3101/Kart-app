import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createOrUpadteAddressByUserId, getAddressByUserId } from "../controllers/addressController";

export const addressRouter = Router();

addressRouter.post("/create-or-update", authMiddleware,createOrUpadteAddressByUserId);
addressRouter.get("/", authMiddleware, getAddressByUserId);
