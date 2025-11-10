import { Request, Response } from "express";
import { AddressModel } from "../models/Address";
import { UserModel } from "../models/User";

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params;

        if (!userId) {
            return res.status(400).json({
                msg: "userId is required"
            })
        }

        const { name, email, phone } = req.body;
        const updateUser = await UserModel.findByIdAndUpdate(userId,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select("name, phone, email");

        if(!updateUser) {
            return res.status(400).json({
                msg: "User Not Found"
            })
        }

        return res.json({
            msg: "user Profile Updated Successfully", updateUser
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}