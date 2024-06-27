"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.initiatePasswordReset = exports.userAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const user_1 = __importDefault(require("../models/user"));
require("dotenv").config();
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FRONTEND_URL = process.env.FRONTEND_URL;
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});
const passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many password reset attempts, please try again later.",
});
const userAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        const user = yield user_1.default.findById(req.session.user.userID);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }
});
exports.userAuthMiddleware = userAuthMiddleware;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield user_1.default.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});
exports.initiatePasswordReset = [
    passwordResetLimiter,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield user_1.default.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            // Generate a reset token and set expiration (1 hour)
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            const resetExpires = new Date(Date.now() + 15 * 60 * 1000);
            user.resetToken = resetToken;
            user.resetExpires = resetExpires;
            yield user.save();
            // Generate the password reset link with the token
            const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
            // Send the reset email with a clickable link
            const mailOptions = {
                from: SMTP_USER,
                to: email,
                subject: "Password Reset Request",
                html: `
                    <p>You requested to reset your password. Click the link below to reset your password:</p>
                    <a href="${resetLink}" style="color: blue; text-decoration: underline;">Reset Password</a>
                    <p>This token will expire in 15 minutes.</p>
                `,
            };
            yield transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Password reset email sent" });
        }
        catch (error) {
            console.error("Error initiating password reset:", error);
            res.status(500).json({ error: "An error occurred while initiating the password reset" });
        }
    }),
];
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, resetToken, newPassword } = req.body;
        const user = yield user_1.default.findOne({ email, resetToken });
        if (!user) {
            return res.status(404).json({ error: "Invalid token or user not found" });
        }
        if (!user.resetExpires || user.resetExpires < new Date()) {
            return res.status(400).json({ error: "Reset token has expired" });
        }
        // Hash the new password before saving
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        // Clear the reset token and its expiration
        user.resetToken = null;
        user.resetExpires = null;
        yield user.save();
        res.status(200).json({ message: "Password has been reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "An error occurred while resetting the password" });
    }
});
exports.resetPassword = resetPassword;
