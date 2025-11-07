import mongoose from "mongoose";

export default async function dbConnect () {
    try {
        const connection = await mongoose.connect(process.env.DB_URL as string);
        console.log("DB Connection Success")
    } catch (error) {
        console.log(error);
        process.exit(1)
    }   
}