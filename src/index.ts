import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import db from "./config";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeRoutes from "./routes/likeRoutes";
import loginRoutes from "./routes/loginRoutes";
import registerRoutes from "./routes/registerRoutes";
import userRoutes from './routes/userRoutes';
import otpRoutes from './routes/otpRoutes';
import recipeRoutes from "./routes/recipeRoutes";
import { v2 as cloudinary } from "cloudinary";


dotenv.config();

const app: Application = express();

const session = require('express-session');

app.use(session({
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: true
}));


const corsOptions = {
  origin: ["https://www.cookconnect.vercel.app/", "https://cookconnect.vercel.app/"]
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));


// Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", registerRoutes);
app.use('/api/v1', loginRoutes);
app.use('/api/v1/otp', otpRoutes);
app.use('/api/v1/', userRoutes);
app.use('/api/v1/users/likes', likeRoutes);
app.use('/api/v1/recipe', recipeRoutes);
app.use('/api/v1/recipe/comments', userRoutes);


// GET route for the API "/"
app.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "CookConnect API" });
});

db.on("error", console.error.bind(console, "Mongodb Connection Error:"));

// Proxy middleware
app.use("/api/v1", createProxyMiddleware({
  target: "http://192.168.43.113:3000/",
  changeOrigin: true,
}));

cloudinary.config({
  secure: true,
});

console.log(cloudinary.config());

const PORT: number | string = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

export default app;