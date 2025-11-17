import { Request, Response } from "express";
import { ProductModel } from "../models/Products";
import { cartModel } from "../models/CartItems";
import { response } from "../utils/responseHandler";

export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {

            return response(res, 400, "Invalid product or quantity");
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return response(res, 404, "Product not found")
        }

        if (product.seller.toString() === userId) {

            return response(res, 400, "You cannot add your own product to the cart")
        }

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                items: []
            });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
        } else {
            cart.items.push({
                product: productId,
                quantity: Number(quantity)
            });
        }

        await cart.save();

        return response(res, 200, "Item added to cart successfully", cart)

    } catch (error) {

        console.error( error);
        return response(res, 500, "Internal Server Error")
    }
}

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId } = req.params;

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {

            return response(res, 400,"Cart Not Found");
        }

        cart.items.pull({ product: productId });

        await cart.save();

        return response(res, 200, "Item removed from cart successfully", cart)

    } catch (error) {
        console.error( error);
        return response(res, 500, "Internal Server Error")
    }
}

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        

        let cart = await cartModel.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return response(res, 404, "Cart is Empty")
        }

        await cart.save();

        return response(res, 200, "Here is your Cart", cart)

    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error")
    }
}