"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validators_1 = require("../middlewares/validators");
const router = express_1.default.Router();
router.post("/initiate-reset", (0, validators_1.passwordResetValidationRules)(), validators_1.validate, authController_1.initiatePasswordReset); // Initiate password reset and send email
router.post("/reset-password", (0, validators_1.passwordResetValidationRules)(), validators_1.validate, authController_1.resetPassword); // Reset password with the reset token
exports.default = router;
