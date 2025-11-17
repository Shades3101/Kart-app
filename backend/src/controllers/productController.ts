import { Request, Response } from "express";
import { uploadToCloud } from "../config/cloudinaryConfig";
import { ProductModel } from "../models/Products";
import { AddressModel } from "../models/Address";
import { response } from "../utils/responseHandler";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;

        const sellerId = req.id;
        const images = req.files as Express.Multer.File[]

        if (!images || images.length === 0) {

            return response(res, 400, "Image is required")

        }

        let parsedPaymentDetails = JSON.parse(paymentDetails);
        if (paymentMode === "UPI" && (!parsedPaymentDetails) || !parsedPaymentDetails.upiId) {

            return response(res, 400, "UPI Id is Required for Payment")
        }

        if (paymentMode === "Bank Account" && (!parsedPaymentDetails || !parsedPaymentDetails.bankDetails || !parsedPaymentDetails.bankDetails.accountNumber || !parsedPaymentDetails.bankDetails.ifscCode || !parsedPaymentDetails.bankDetails.bankName)) {

            return response(res, 400, "Bank Account details required for payment")
        }

        const uploadPromise = images.map(file => uploadToCloud(file));
        const uploadImages = await Promise.all(uploadPromise);
        const imageUrl = uploadImages.map(image => image.secure_url);

        const Product = await ProductModel.create({
            title,
            description,
            subject,
            condition,
            category,
            classType,
            price,
            finalPrice,
            author,
            shippingCharge,
            paymentMode,
            paymentDetails: parsedPaymentDetails,
            edition,
            seller: sellerId,
            images: imageUrl
        })

        return response(res, 200, "Product Created", Product)
        
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error")
    }
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 }).populate('seller', 'name email')

        return response(res, 200, "Product Fetched SuccessFully", products)

    } catch (error) {
        console.log(error);

        return response(res, 500, "Internal Server Error")
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.findById(req.params.id).populate({
            path: "seller",
            select: "name email profilePicture phone addresses"
        })

        if (!product) {
            return response(res, 404, "Product not found")
        }

            //fail safe 
        if (product.seller && product.seller._id) {
            const addresses = await AddressModel.find({ user: product.seller._id });
            
            if (addresses.length > 0) {
                (product.seller as any).addresses = addresses;
            } else {
                (product.seller as any).addresses = [];
            }
        }
        
        return response(res, 200, "Product Fetched SuccessFully", product)

    } catch (error) {
        console.log(error);

        return response(res, 500, "Internal Server Error")
        
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.productId);

        if (!product) {

            return response(res, 404, "Product not found")
        }

        return response(res, 200, "Product Deleted SuccessFully")

    } catch (error) {
        console.log(error);

        return response(res, 500, "Internal Server Error")
    }
}

export const getProductBySeller = async (req: Request, res: Response) => {
    try {
        const sellerId = req.params.sellerId;

        if (!sellerId) {
            return response(res, 400, "no seller for this id")
        }

        const product = await ProductModel.find({ seller: sellerId }).sort({ createdAt: -1 }).populate("seller", "name email profilePicture phone addresses")

        if (!product) {

            return response(res, 404, "Product not found for this seller")
        }

        return response(res, 200, "Product Fetched SuccessFully", product)

    } catch (error) {
        console.log(error);

        return response(res, 500, "Internal Server Error")
    }
}