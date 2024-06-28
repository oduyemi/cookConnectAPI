"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const config_1 = require("./config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const registerRoutes_1 = __importDefault(require("./routes/registerRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const otpRoutes_1 = __importDefault(require("./routes/otpRoutes"));
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const appError_1 = __importDefault(require("./utils/appError"));
const uploadMiddleware_1 = __importDefault(require("./middlewares/uploadMiddleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: config_1.store,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));
const corsOptions = {
    origin: ["http://localhost:3000", "https://cookconnect.vercel.app", "https://www.cookconnect.vercel.app"]
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use("/v1", authRoutes_1.default);
app.use("/v1", registerRoutes_1.default);
app.use('/v1', loginRoutes_1.default);
app.use('/v1/otp', otpRoutes_1.default);
app.use('/v1/', userRoutes_1.default);
app.use('/v1/likes', likeRoutes_1.default);
app.use('/v1/recipes', recipeRoutes_1.default);
app.use('/v1/comments', commentRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`The route ${req.originalUrl} with the ${req.method} method does not exist on this server! 💨`, 404));
});
config_1.db.on("error", console.error.bind(console, "Mongodb Connection Error:"));
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });
// console.log('Cloudinary configuration complete');
// Multer middleware route for file upload
app.post('/upload', uploadMiddleware_1.default.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
exports.default = app;
