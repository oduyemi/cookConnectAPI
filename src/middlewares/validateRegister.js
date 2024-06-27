"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.registerValidationRules = void 0;
const express_validator_1 = require("express-validator");
const registerValidationRules = () => [
    (0, express_validator_1.check)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.check)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];
exports.registerValidationRules = registerValidationRules;
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validate = validate;
