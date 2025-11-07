import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request{
            id: string
        }
    }
}

 export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    const secret = process.env.JWT_SECRET as string

    if(!token) {
        
        return res.status(401).json({
            msg: "user not Authenticated"
        })
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;

        if(!decoded) {
            return res.status(401).json({
                msg: "User not Found"
            })
        }

        req.id = decoded.userId;
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "token not valid"
        })
    }
}