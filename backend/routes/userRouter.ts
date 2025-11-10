import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { updateUserProfile } from "../controllers/userController";


export const userRouter = Router();

userRouter.put("/create-or-update", authMiddleware,updateUserProfile);

