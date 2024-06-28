import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import crypto from "crypto";
import TemporaryUser, { ITemporaryUser } from "../models/temporaryUser";
import User, { IUser } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://cookconnect.vercel.app/verify";

if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_USER or SMTP_PASS is not defined. Check your .env file.");
}

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined. Check your .env file.");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

const generateOTP = (): string => {
    return crypto.randomInt(100000, 1000000).toString(); // Generate 6-digit OTP
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        if (![firstName, lastName, email, password, confirmPassword].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Both passwords must match!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const existingTempUser = await TemporaryUser.findOne({ email });
        if (existingTempUser) {
            await TemporaryUser.deleteOne({ email });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        const tempUser = new TemporaryUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });

        await tempUser.save();

        const mailOptions = {
            from: SMTP_USER,
            to: email,
            subject: "Verify your email address",
            text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`,
            html: `
                <h1>Verify Your Email Address</h1>
                <p>Your OTP is: <strong>${otp}</strong>. This OTP will expire in 5 minutes.</p>
                <p>Please enter this OTP on our website to verify your email.</p>
                <a href="${FRONTEND_URL}" style="display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 4px;">
                  Click Here to Verify
                </a>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "Registration initiated! Please check your email to verify your account.",
        });

    } catch (error: any) {
        console.error("Error during registration process:", error);
        return res.status(500).json({ message: "Error registering user", error: error.message });
    }
};


