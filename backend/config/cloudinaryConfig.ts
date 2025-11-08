import multer from "multer";
import {v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import { RequestHandler } from "express";
import fs from "fs";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUD_API_KEY as string,
    api_secret: process.env.CLOUD_API_SECRET as string
})

interface CustomFile extends Express.Multer.File {
    path: string
}

const uploadToCloud = (file: CustomFile) : Promise<UploadApiResponse> => {

    const options: UploadApiOptions = {
        resource_type: "image",
        folder: "kart"
    } 

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, options, (error, result) => {

            fs.unlink(file.path, () => {});

            if(error) {
                return reject(error)
            }
            resolve(result as UploadApiResponse)
        })
    })
}

const multerMiddleware: RequestHandler = multer({ dest: "upload/"}).array('images',4)

export {multerMiddleware, uploadToCloud};