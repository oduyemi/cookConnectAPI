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
exports.protect = exports.userAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const userAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" });
        }
        const user = yield user_1.default.findById(req.session.user.userID);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Authentication message:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }
});
exports.userAuthMiddleware = userAuthMiddleware;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log("Token received on server:", token); // Debugging: log the token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded); // Debugging: log the decoded token
            const user = yield user_1.default.findById(decoded.userId).select('-password');
            console.log("User retrieved:", user); // Debugging: log the user
            if (!user) {
                console.log("User not found for token"); // Debugging: log if user not found
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.error('Token verification error:', error.message); // Log the error message
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        console.log("No token provided"); // Debugging: log if no token provided
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});
exports.protect = protect;
