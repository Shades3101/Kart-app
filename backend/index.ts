import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnect";
import { authRouter } from "./routes/authRoute";
import { productRouter } from "./routes/productRoute";
import { cartRouter } from "./routes/cartRouter";
import { wishListRouter } from "./routes/wishListRouter";
import { addressRouter } from "./routes/addressRoute";
import { userRouter } from "./routes/userRouter";
import { orderRouter } from "./routes/orderRouter";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FE_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
dbConnect();


app.use("/api/auth", authRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/wishlist", wishListRouter)
app.use("/api/user/address", addressRouter)
app.use("/api/user", userRouter)
app.use("/api/order", orderRouter)

app.listen(3001, () => {
    console.log("listening on Port 3001")
})