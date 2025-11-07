import { Request, Response } from "express";
import { UserModel } from "../models/User";
import crypto  from "crypto";
import { sendResetEmail, sendVerifyEmail } from "../config/emailConfig";
import generateToken from "../utils/GenerateToken";

export  default async function register ( req: Request, res: Response) {

    try {
        const {name, email, password , agreeTerms} = req.body;
        const existingUser = await UserModel.findOne({
            email
        })

        if(existingUser) {

            return res.status(400).json({
                msg: "User Already exists"
            })
        }

        const randomCrypto = crypto.randomBytes(20).toString('hex');
        const user = await UserModel.create({
            name,
            email,
            password,
            agreeTerms,
            token : randomCrypto
        })

        const result = await sendVerifyEmail(user.email, randomCrypto)
        console.log(result)
        return res.json({
            msg: "Signup Success"
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const verifyEmail = async (req : Request, res: Response) => {
    try {
        const token = req.params;
        const user = await UserModel.findOne({
            token
        })

        if(!user) {
            return res.status(400).json({
                msg: "Invalid or Expired Token"
            })
        }

        user.isVerified = true;
        user.token = undefined;

        const accessToken = generateToken(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        await user.save();
        return res.json({
            msg: "Email Verification Successful"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error, Please Try Again"
        })
    }
}

export const login = async (req : Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({
            email
        })

        if(!user || !(await user.comparePass(password))) {
            return res.status(400).json({
                msg: "Invalid Email or Password "
            })
        }

        if(!user.isVerified) {
            return res.status(400).json({
                msg: "Verify Your Email Before Loggin In"
            })
        }

        const accessToken = generateToken(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.json({
            msg: "Login successfull"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error, Please Try Again"
        })
    }
}

export const forgotPass = async (req: Request, res: Response) =>{
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({
            email
        })

        if(!user) {
            return res.status(400).json({
                msg: `No user exists with this ${email}id`
            })
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPassToken = resetToken;
        user.resetPassExpire = new Date(Date.now() + 3600000)
        await user.save();

        await sendResetEmail(user.email, resetToken);
        
        return res.json({
            msg: "Reset link Sent to the mail"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error, Please Try Again"
        })
    }
}

export const resetPass = async (req : Request, res: Response) => {
    try {
        const token = req.params;
        const {newPassword}  = req.body;

        const user = await UserModel.findOne({
            resetPassToken:token,
            resetPassExpire: {$gt : Date.now()}
        })

        if(!user) {
            return res.status(400).json({
                msg: "Invalid or Expired Token"
            })
        }

        user.password = newPassword;
        user.resetPassToken = null as any;
        user.resetPassExpire = null as any;

        const accessToken = generateToken(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        await user.save();

        return res.json({
            msg: "Password Reset Successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error, Please Try Again"
        })
    }
}

export const logout = async( req: Request, res: Response) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
        })

        return res.json({
            msg: "Successfully Logged Out"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const checkUserAuth = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        if(!userId) {
            
            return res.status(400).json({
                msg: "unauthenticated"
            })
        }

        const user = await UserModel.findById(userId).select("name, email")
        if(!user) {
            return res.status(403).json({
                msg: "user not found"
            })
        }

        return res.json({
            msg: "user retrieved SuccessFully"
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: "Internal Server Error, Please Try Again"
        })
    }
}