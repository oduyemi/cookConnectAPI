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
exports.registerUser = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
require("dotenv").config();
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_USER or SMTP_PASS is not defined. Check your .env file.");
}
const transporter = nodemailer_1.default.createTransport({
    host: "premium194.web-hosting.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});
const generateOTP = () => {
    return crypto_1.default.randomInt(1000, 10000).toString();
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, username, password, confirmPassword } = req.body;
        if (![firstName, lastName, email, username, password, confirmPassword].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const existingUserByUsername = yield user_1.default.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username not available" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        const newUser = new user_1.default({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            otp,
            otpExpires,
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({
            userId: newUser._id,
            email: newUser.email
        }, process.env.JWT_SECRET, { expiresIn: "30m" });
        const userSession = {
            userID: newUser._id,
            firstName,
            lastName,
            email,
            username,
            bio: "",
            img: "",
            createdAt: newUser.createdAt
        };
        req.session.user = userSession;
        const frontendUrl = "http://localhost:3000";
        const mailOptions = {
            from: SMTP_USER,
            to: email,
            subject: "Verify your email address",
            text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`,
            html: `
                <h1>Verify Your Email Address</h1>
                <p>Your OTP is: <strong>${otp}</strong>. This OTP will expire in 5 minutes.</p>
                <p>Please enter this OTP on our website to verify your email.</p>
                <a href="${frontendUrl}" style="display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 4px;">
                  Click Here to Verify
                </a>
            `,
        };
        yield transporter.sendMail(mailOptions);
        res.status(201).json({
            message: "Registration successful! OTP sent to email.",
            token,
            nextStep: "/next-login-page",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error registering user" });
    }
});
exports.registerUser = registerUser;
