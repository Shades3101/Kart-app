import { Router } from "express";
import register, { checkUserAuth, login, logout, resetPass, verifyEmail } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

export const authRouter = Router();

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/verify/:token", verifyEmail)
authRouter.post("/forgot-password/:token", resetPass)
authRouter.get("/logout", logout)
authRouter.get("/verify-auth", authMiddleware, checkUserAuth)