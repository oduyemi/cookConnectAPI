"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const config_1 = __importDefault(require("./config"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const registerRoutes_1 = __importDefault(require("./routes/registerRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const otpRoutes_1 = __importDefault(require("./routes/otpRoutes"));
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
const app = (0, express_1.default)();
const session = require('express-session');
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));
const corsOptions = {
    origin: ["http://localhost:3000"]
};
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
// Routes
app.use("/api/v1", authRoutes_1.default);
app.use("/api/v1", registerRoutes_1.default);
app.use('/api/v1', loginRoutes_1.default);
app.use('/api/v1/otp', otpRoutes_1.default);
app.use('/api/v1/', userRoutes_1.default);
app.use('/api/v1/users/likes', likeRoutes_1.default);
app.use('/api/v1/recipe', recipeRoutes_1.default);
app.use('/api/v1/recipe/comments', userRoutes_1.default);
// GET route for the API "/"
app.get("/api/v1", (req, res) => {
    res.json({ message: "CookConnect API" });
});
config_1.default.on("error", console.error.bind(console, "Mongodb Connection Error:"));
// Proxy middleware
app.use("/api/v1", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: "http://192.168.43.113:3000/",
    changeOrigin: true,
}));
cloudinary_1.v2.config({
    secure: true,
});
console.log(cloudinary_1.v2.config());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
exports.default = app;
