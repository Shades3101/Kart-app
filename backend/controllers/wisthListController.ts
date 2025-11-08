import { Request, Response } from "express";
import { ProductModel } from "../models/Products";
import { wishListModel } from "../models/WishList";

export const addToWishList = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId} = req.body;

        if (!productId) {
            return res.status(400).json({ msg: "Invalid product" });
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        let wishList = await wishListModel.findOne({ user: userId });

        if (!wishList) {
            wishList = await wishListModel.create({
                user: userId,
                products: []
            });
        }
        
        if(!wishList.products.includes(productId)) {
            wishList.products.push(productId);
            await wishList.save();
        }

        return res.status(200).json({
            msg: "Item added to wishList successfully", wishList
        });

    } catch (error) {
        console.error( error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}

export const removeFromWishList = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId } = req.params;

        let wishList = await wishListModel.findOne({ user: userId });

        if (!wishList) {

            return res.status(400).json({
                msg: "wishList Not Found"
            })
        }

        wishList.products = wishList.products.filter((id) => id.toString()!== productId)
        await wishList.save();

        return res.status(200).json({
            msg: "Item removed from wishList successfully"
        });

    } catch (error) {
        console.error( error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}

export const getWishList = async (req: Request, res: Response) => {
    try {
        const userId = req?.id;

        let wishList = await wishListModel.findOne({ user: userId }).populate('products');

        if (!wishList) {
            return res.status(404).json({
                msg: "wishList is Empty", 
            })
        }

        await wishList.save();

        return res.status(200).json({
            msg: "Here is your wishList", wishList
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}