import { Request, Response } from "express";
import { ProductModel } from "../models/Products";
import { wishListModel } from "../models/WishList";
import { response } from "../utils/responseHandler";

export const addToWishList = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        if (!productId) {

            return response(res, 400, "Invalid product")
        }

        const product = await ProductModel.findById(productId);

        if (!product) {

            return response(res, 404, "Product not found")
        }

        let wishList = await wishListModel.findOne({ user: userId });

        if (!wishList) {
            wishList = await wishListModel.create({
                user: userId,
                products: []
            });
        }

        if (!wishList.products.includes(productId)) {
            wishList.products.push(productId);
            await wishList.save();
        }

        return response(res, 200, "Item added to wishList successfully", wishList)


    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const removeFromWishList = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId } = req.params;

        let wishList = await wishListModel.findOne({ user: userId });

        if (!wishList) {

            return response(res, 404, "wishList Not Found")
        }

        wishList.products = wishList.products.filter((id) => id.toString() !== productId)
        await wishList.save();

        return response(res, 200, "Item removed from wishList successfully")

    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error");
    }
}

export const getWishList = async (req: Request, res: Response) => {
    try {
        const userId = req?.id;

        let wishList = await wishListModel.findOne({ user: userId }).populate('products');

        if (!wishList) {

            return response(res, 404, "wishList is Empty",)
        }

        await wishList.save();

        return response(res, 200, "Here is your wishList", wishList)

    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error")
    }
}