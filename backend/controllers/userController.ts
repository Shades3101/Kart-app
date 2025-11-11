import { Request, Response } from "express";
import { AddressModel } from "../models/Address";
import { UserModel } from "../models/User";
import { response } from "../utils/responseHandler";

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params;

        if (!userId) {
            return response(res, 400, "userId is required")
        }

        const { name, email, phone } = req.body;
        const updateUser = await UserModel.findByIdAndUpdate(userId,
            { name, email, phone },
            { new: true, runValidators: true }
        ).select("name, phone, email");

        if(!updateUser) {
            return response(res, 400, "User Not Found")
        }

        return response(res, 200, "user Profile Updated Successfully", updateUser)
    }
    catch (error) {
        console.log(error);
        return response(res, 400, "Internal Server Error")
    }
}