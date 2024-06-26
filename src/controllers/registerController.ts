import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt, { hash, compare } from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";
import User, { IUser } from "../models/user";

const router = express.Router();

require("dotenv").config();


const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_USER or SMTP_PASS is not defined. Check your .env file.");
}

const transporter = nodemailer.createTransport({
    host: "premium194.web-hosting.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

const generateOTP = (): string => {
    return crypto.randomInt(1000, 10000).toString();
};

const registerUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, username, password, confirmPassword } = req.body;
        if (![firstName, lastName, email, username, password, confirmPassword].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username not available" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        const newUser: IUser = new User({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        await newUser.save();
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email
            },
            process.env.JWT_SECRET!,
            { expiresIn: "30m" } 
        );

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

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "Registration successful! OTP sent to email.",
            token,
            nextStep: "/next-login-page",
        });

    } catch (error) {

        return res.status(500).json({ message: "Error registering user"})
    }
};

export { registerUser };