import { Request, Response } from "express";
import User from "../models/user";

const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Email found" });
    }

    if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const currentDateTime = new Date();
    if (!user.otpExpires || currentDateTime > user.otpExpires) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    user.emailVerified = true;
    user.otp = null; 
    user.otpExpires = null; 

    try {
        await user.save();
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "An error occurred while verifying the email" });
    }
};

export { verifyOTP };