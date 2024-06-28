import express, { Request, Response } from "express";
import TemporaryUser from '../models/temporaryUser';
import User from '../models/user';

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        console.log(`Received OTP verification request for email: ${email} and OTP: ${otp}`);

        const tempUser = await TemporaryUser.findOne({ email });
        if (!tempUser) {
            console.log("Temporary user not found for email:", email);
            return res.status(404).json({ message: "Invalid OTP or email." });
        }

        console.log("Temporary user found:", tempUser);

        if (tempUser.otpExpires < new Date()) {
            console.log("OTP has expired for email:", email);
            await TemporaryUser.deleteOne({ email });
            return res.status(400).json({ message: "OTP expired." });
        }

        if (tempUser.otp !== otp) {
            console.log("Invalid OTP provided for email:", email);
            return res.status(400).json({ message: "Invalid OTP." });
        }

        const newUser = new User({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            password: tempUser.password,
        });

        await newUser.save();
        await TemporaryUser.deleteOne({ email });

        console.log("Email verification successful for email:", email);
        res.status(200).json({ message: "Email verification successful!" });
    } catch (error: any) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};
