import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect";
import { authRouter } from "./routes/authRoute";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FE_URL,
    credentials: true
}))
app.use(express.json());
dbConnect();

app.use("/api/auth", authRouter)

app.listen(3001, () => {
    console.log("listening on Port 3001")
})