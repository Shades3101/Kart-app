import { NextFunction, Request, Response, Router } from "express";
import register, { checkUserAuth, login, logout, resetPass, verifyEmail } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import passport from "passport";
import { user } from "../models/User";
import generateToken from "../utils/GenerateToken";

export const authRouter = Router();

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/verify/:token", verifyEmail)
authRouter.post("/forgot-password/:token", resetPass)
authRouter.get("/logout", logout)
authRouter.get("/verify-auth", authMiddleware, checkUserAuth);

authRouter.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

// google callback Router

authRouter.get("/google/callback", passport.authenticate("google", {failureRedirect: `${process.env.FE_URL}`, 
session: false
}),
    async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
        try {
            const user = req.user as user;
            const accessToken = await generateToken(user)
            res.cookie ("access_token", accessToken, {
                httpOnly: true,
                maxAge: 24* 60 * 60* 1000
            })

            res.redirect(`${process.env.FE_URL}`)
        } catch (error) {
            next(error)
        }
    }
)