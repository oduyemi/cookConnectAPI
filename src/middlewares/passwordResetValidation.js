"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.passwordResetValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Validation rules for password reset
const passwordResetValidationRules = () => [
    (0, express_validator_1.check)('email').isEmail().withMessage('Must be a valid email'),
    (0, express_validator_1.check)('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
exports.passwordResetValidationRules = passwordResetValidationRules;
// Middleware to validate input
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
