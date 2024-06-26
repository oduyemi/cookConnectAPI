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
exports.verifyOTP = void 0;
const user_1 = __importDefault(require("../models/user"));
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield user_1.default.findOne({ email });
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
        yield user.save();
        res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "An error occurred while verifying the email" });
    }
});
exports.verifyOTP = verifyOTP;
