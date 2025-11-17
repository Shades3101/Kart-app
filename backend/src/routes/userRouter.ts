import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { updateUserProfile } from "../controllers/userController";


export const userRouter = Router();

userRouter.put("/profile/update/:id", authMiddleware,updateUserProfile);

