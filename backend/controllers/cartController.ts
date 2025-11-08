import { Request, Response } from "express";
import { ProductModel } from "../models/Products";
import { cartModel } from "../models/CartItems";

export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ msg: "Invalid product or quantity" });
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        if (product.seller.toString() === userId) {
            return res.status(400).json({
                msg: "You cannot add your own product to the cart"
            });
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

        return res.status(200).json({
            msg: "Item added to cart successfully"
        });

    } catch (error) {
        console.error( error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { productId } = req.params;

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {

            return res.status(400).json({
                msg: "Cart Not Found"
            })
        }

        cart.items.pull({ product: productId });

        await cart.save();

        return res.status(200).json({
            msg: "Item removed from cart successfully"
        });

    } catch (error) {
        console.error( error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {

            return res.status(404).json({
                msg: "Cart is Empty"
            })
        }

        await cart.save();

        return res.status(200).json({
            msg: "Here is your Cart", cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}