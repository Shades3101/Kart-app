import { Request, Response } from "express";
import { AddressModel } from "../models/Address";
import { UserModel } from "../models/User";
import { response } from "../utils/responseHandler";

export const createOrUpadteAddressByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { addressLine1, addressLine2, phone, city, state, pincode, addressId } = req.body;

        if (!userId) {

            return response(res, 400, "userId not found")
        }

        if (!addressLine1 || !phone || !city || !state || !pincode) {

            return response(res, 400, "Enter All values before proceeding")
        }

        if (addressId) {
            const existingAddress = await AddressModel.findById(addressId);
            if (!existingAddress) {

                return response(res, 400, "Address Not Found")
            }

            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.phone = phone;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;

            await existingAddress.save();

            return response(res, 200, "Address updated Successfully", existingAddress)

        } else {
            const newAddress = await AddressModel.create({
                user: userId,
                addressLine1,
                addressLine2,
                state,
                city,
                phone,
                pincode
            })

            const address = await UserModel.findByIdAndUpdate(
                userId,
                { $push: { addresses: newAddress._id } },
                { new: true }
            )

            return response(res, 200, "New Address Added Successfully", address)
        }
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const getAddressByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.id;

        if (!userId) {

            return response(res, 400, "userId not found")
        }

        const address = await UserModel.findById(userId).populate("addresses")
        if (!address) {
            return response(res, 404, "No Addresses Found")
        }

        return response(res, 200, "Addresses Retrieved Successfully", address)

    } catch (error) {
        
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}