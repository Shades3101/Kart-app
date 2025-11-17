import { Request, Response } from "express";
import { UserModel } from "../models/User";
import crypto  from "crypto";
import { sendResetEmail, sendVerifyEmail } from "../config/emailConfig";
import generateToken from "../utils/GenerateToken";
import { response } from "../utils/responseHandler";

export  default async function register ( req: Request, res: Response) {

    try {
        const {name, email, password , agreeTerms} = req.body;
        const existingUser = await UserModel.findOne({
            email
        })

        if(existingUser) {

            return response(res, 400, "User Already Exists")
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
        return response(res, 200, "Signup Success")

    } catch (error) {
        console.log(error);
        
        return response(res, 500, "Internal Server Error")
    }
}

export const verifyEmail = async (req : Request, res: Response) => {
    try {
        const { token } = req.params;
        const user = await UserModel.findOne({
            token
        })

        if(!user) {
            return response(res, 400, "Invalid or Expired Token")
        }

        user.isVerified = true;
        user.token = undefined;

        const accessToken = generateToken(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        await user.save();
        return response(res, 200, "Email Verification Successful")
        
        
    } catch (error) {
        console.log(error);
       return response(res, 500, "Internal Server Error")
    }
}

export const login = async (req : Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({
            email
        })

        if(!user || !(await user.comparePass(password))) {
            return response(res, 400,"Invalid Email or Password")
           
        }

        if(!user.isVerified) {
            return response(res, 400,"Verify Your Email Before Loggin In")
        }

        const accessToken = generateToken(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        return response(res, 200,"Login Successfull", {user: {name: user.name, email: user.email}}) 
        
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const forgotPass = async (req: Request, res: Response) =>{
    try {
        const { email } = req.body;
        console.log(email)
        const user = await UserModel.findOne({
            email
        })

        if(!user) {
            return response(res, 400,`No user exists with this ${email}id`)
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPassToken = resetToken;
        user.resetPassExpire = new Date(Date.now() + 3600000)
        await user.save();

        await sendResetEmail(user.email, resetToken);

        return response(res, 200, "Reset link Sent to the mail")
        

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const resetPass = async (req : Request, res: Response) => {
    try {
        const {token} = req.params;
        const {newPassword}  = req.body;

        const user = await UserModel.findOne({
            resetPassToken:token,
            resetPassExpire: {$gt : Date.now()}
        })

        if(!user) {
            return response(res, 400, "Invalid or Expired Token")
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

        return response(res, 200, "Password Reset SuccessFully")
        
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const logout = async( req: Request, res: Response) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
        })

        return response(res, 200, "Successfully Logged Out")
        
    } catch (error) {
        console.log(error)
        return response(res, 500, "Internal Server Error")
    }
}

export const checkUserAuth = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        if(!userId) {
            return response(res, 400, "unauthenticated")

        }

        const user = await UserModel.findById(userId).select("-password -token -resetPassToken -resetPassExpire")
        if(!user) {
             return response(res, 400, "user not found")
        }
        return response(res, 200, "Authenticated", user)
       
    } catch (e) {
        console.log(e);
        return response(res, 500, "Internal Server Error")
    }
}