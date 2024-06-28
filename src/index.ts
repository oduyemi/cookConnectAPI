import express, { Application } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import session from 'express-session';
import { db, store } from "./config";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeRoutes from "./routes/likeRoutes";
import loginRoutes from "./routes/loginRoutes";
import registerRoutes from "./routes/registerRoutes";
import userRoutes from './routes/userRoutes';
import otpRoutes from './routes/otpRoutes';
import recipeRoutes from "./routes/recipeRoutes";
import AppError from "./utils/appError";
import upload from "./middlewares/uploadMiddleware";


dotenv.config();

const app: Application = express();

app.use(session({
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

const corsOptions = {
  origin: ["http://localhost:3000", "https://cookconnect.vercel.app", "https://www.cookconnect.vercel.app"]
};
app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/v1", authRoutes);
app.use("/v1", registerRoutes);
app.use('/v1', loginRoutes);
app.use('/v1/otp', otpRoutes);
app.use('/v1/', userRoutes);
app.use('/v1/likes', likeRoutes);
app.use('/v1/recipes', recipeRoutes);
app.use('/v1/comments', commentRoutes);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `The route ${req.originalUrl} with the ${req.method} method does not exist on this server! 💨`,
      404
    )
  );
});

db.on("error", console.error.bind(console, "Mongodb Connection Error:"));



// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// console.log('Cloudinary configuration complete');

// Multer middleware route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});


const PORT: number | string = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

export default app;
