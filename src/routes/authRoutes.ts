import express from "express";
import { initiatePasswordReset, resetPassword } from "../controllers/authController";
import { passwordResetValidationRules, validate } from "../middlewares/validators";

const router = express.Router();

router.post("/initiate-reset", passwordResetValidationRules(), validate, initiatePasswordReset); // Initiate password reset and send email
router.post("/reset-password", passwordResetValidationRules(), validate, resetPassword); // Reset password with the reset token

export default router;