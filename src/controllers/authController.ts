import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import User from '../models/user';

require("dotenv").config();

interface UserSession {
    userID: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    bio?: string;
    img?: string;
    createdAt?: Date;
    lastLogin?: Date;
    updatedAt?: Date;
}

declare module "express-session" {
    interface SessionData {
        user?: UserSession;
    }
}

const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;
const FRONTEND_URL = process.env.FRONTEND_URL!;


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, 
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});


const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: "Too many password reset attempts, please try again later.",
});


export const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const user = await User.findById(req.session.user.userID);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }
};

const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


export const initiatePasswordReset = [
    passwordResetLimiter,
    async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Generate a reset token and set expiration (1 hour)
            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetExpires = new Date(Date.now() + 15 * 60 * 1000); 

            user.resetToken = resetToken;
            user.resetExpires = resetExpires;

            await user.save();

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

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "Password reset email sent" });
        } catch (error: any) {
            console.error("Error initiating password reset:", error);
            res.status(500).json({ error: "An error occurred while initiating the password reset" });
        }
    },
];


export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        const user = await User.findOne({ email, resetToken });

        if (!user) {
            return res.status(404).json({ error: "Invalid token or user not found" });
        }

        if (!user.resetExpires || user.resetExpires < new Date()) {
            return res.status(400).json({ error: "Reset token has expired" });
        }

        // Hash the new password before saving
        user.password = await bcrypt.hash(newPassword, 10);

        // Clear the reset token and its expiration
        user.resetToken = null;
        user.resetExpires = null;

        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error: any) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "An error occurred while resetting the password" });
    }
};