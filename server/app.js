import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./src/routes/user.routes.js";
import messageRouter from "./src/routes/message.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares you can say...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);


export default app; 

