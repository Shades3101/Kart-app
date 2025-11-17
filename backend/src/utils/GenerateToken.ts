import jwt from "jsonwebtoken";
import { user } from "../models/User";

const secret = process.env.JWT_SECRET

export default function generateToken(user: user) : string {

    return jwt.sign({
        userId: user._id
    }, secret as string, {expiresIn:'1d'})
}