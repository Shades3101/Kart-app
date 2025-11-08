import { Request, Response } from "express";
import { uploadToCloud } from "../config/cloudinaryConfig";
import { ProductModel } from "../models/Products";

export const createProduct  = async (req: Request, res: Response) => {
    try {
        const { title, subject, category, condition, classType, price, author, edition, description ,finalPrice, shippingCharge, paymentMode, paymentDetails} = req.body;

        const sellerId = req.id;
        const images = req.files as Express.Multer.File[]
        
        if(!images || images.length === 0) {
            
            return res.status(400).json({
                msg: "Image is required"
            })
        }

        let parsedPaymentDetails = JSON.parse(paymentDetails);
        if(paymentMode === "UPI" && (!parsedPaymentDetails) || !parsedPaymentDetails.upiId) {

            return res.status(400).json({
                msg: "UPI Id is Required for Payment"
            })
        }

        if(paymentMode === "Bank Account" && (!parsedPaymentDetails || !parsedPaymentDetails.bankDetails || !parsedPaymentDetails.bankDetails.accountNumber || !parsedPaymentDetails.bankDetails.ifscCode || !parsedPaymentDetails.bankDetails.bankName)) {

            return res.status(400).json({
                msg: "Bank Account details required for payment"
            })
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

        return res.json(
            {msg: "Product Create", Product}
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const getAllProducts = async  (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 }).populate('seller', 'name email')

        return res.json({
            msg: "Product Fetched SuccessFully", products
        })

    } catch (error) {
         console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const getProductById = async (req: Request, res: Response) => {
     try {
        const product = await ProductModel.findById(req.params.id).populate({
            path: "seller",
            select: "name email profilePicture phone addresses",
            populate: {
                path: "addresses",
                model: "Address"
            }
        })

        if(!product) {
            return res.status(404).json({
                msg: "Product not found"
            })
        }

        return res.json({
            msg: "Product Fetched SuccessFully", product
        })

    } catch (error) {
         console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const deleteProduct  = async (req: Request, res: Response) => {
     try {
        const product = await ProductModel.findByIdAndDelete(req.params.productId);

         if(!product) {
            return res.status(404).json({
                msg: "Product not found"
            })
        }

        return res.json({
            msg: "Product Deleted SuccessFully", 
        })

    } catch (error) {
         console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const getProductBySeller = async (req: Request, res: Response) => {
    try {
        const sellerId = req.params.sellerId;

        if(!sellerId) {
            return res.status(400).json({
               msg: "no seller for this id"
            })
        }

        const product = await ProductModel.find({ seller: sellerId }).sort({ createdAt: -1 }).populate("seller", "name email profilePicture phone addresses")

        if(!product) {
            return res.status(404).json({
                msg: "Product not found for this seller"
            })
        }

        return res.json({
            msg: "Product Fetched SuccessFully", product
        })

    } catch (error) {
         console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}