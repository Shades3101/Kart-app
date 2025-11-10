import { Request, Response } from "express";
import { AddressModel } from "../models/Address";
import { UserModel } from "../models/User";

export const createOrUpadteAddressByUserId = async (req: Request , res: Response) => {
    try {
        const userId = req.id;
        const {addressLine1, addressLine2, phone, city, state, pincode, addressId} = req.body;

        if(!userId) {
            return res.status(400).json({
                msg: "userId not found"
            })
        }

        if(!addressLine1 || !phone || !city || !state || !pincode) {
            return res.status(400).json({
                msg: "Enter All values before proceeding"
            })
        }

        if(addressId) {
            const existingAddress = await AddressModel.findById(addressId);
            if(!existingAddress) {
                return res.status(400).json({
                    msg: "Address Not Found"
                })
            }

            existingAddress.addressLine1 = addressLine1;
            existingAddress.addressLine2 = addressLine2;
            existingAddress.phone = phone;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.pincode = pincode;

            await existingAddress.save();
            
            return res.status(200).json({
                msg: "Address updated Successfully", existingAddress
            })

        } else{
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
                {$push: {addresses: newAddress._id}},
                {new: true}
            )
            return res.json({
                msg: "New Address Added Successfully", address
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const getAddressByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        
        if(!userId) {
            return res.status(400).json({
                msg: "userId not found"
            })
        }
        
        const address = await UserModel.findById(userId).populate("addresses")
        if(!address) {
            return res.status(404).json({
                msg: "No Addresses Found"
            })
        }

        return res.status(200).json({
            msg: "Addresses Retrieved Successfully", address
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}