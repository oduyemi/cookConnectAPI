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
const temporaryUser_1 = __importDefault(require("../models/temporaryUser"));
const user_1 = __importDefault(require("../models/user"));
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        console.log(`Received OTP verification request for email: ${email} and OTP: ${otp}`);
        const tempUser = yield temporaryUser_1.default.findOne({ email });
        if (!tempUser) {
            console.log("Temporary user not found for email:", email);
            return res.status(404).json({ message: "Invalid OTP or email." });
        }
        console.log("Temporary user found:", tempUser);
        if (tempUser.otpExpires < new Date()) {
            console.log("OTP has expired for email:", email);
            yield temporaryUser_1.default.deleteOne({ email });
            return res.status(400).json({ message: "OTP expired." });
        }
        if (tempUser.otp !== otp) {
            console.log("Invalid OTP provided for email:", email);
            return res.status(400).json({ message: "Invalid OTP." });
        }
        const newUser = new user_1.default({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            password: tempUser.password,
        });
        yield newUser.save();
        yield temporaryUser_1.default.deleteOne({ email });
        console.log("Email verification successful for email:", email);
        res.status(200).json({ message: "Email verification successful!" });
    }
    catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
});
exports.verifyOTP = verifyOTP;
