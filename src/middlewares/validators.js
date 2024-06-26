"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.lastNameValidationRules = exports.firstNameValidationRules = exports.userValidationRules = exports.passwordResetValidationRules = exports.loginValidationRules = void 0;
const express_validator_1 = require("express-validator");
// Reusable validation rules
const isEmail = (0, express_validator_1.check)("email").isEmail().withMessage("Must be a valid email");
const isPassword = (0, express_validator_1.check)("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long");
const isRequiredString = (field, message) => (0, express_validator_1.check)(field).isString().withMessage(message).notEmpty().withMessage(`${field} is required`);
const isPositiveInteger = (field, message) => (0, express_validator_1.check)(field).isInt({ min: 1 }).withMessage(message);
const loginValidationRules = () => [
    isEmail,
    isPassword,
];
exports.loginValidationRules = loginValidationRules;
const passwordResetValidationRules = () => [
    isEmail,
    (0, express_validator_1.check)("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];
exports.passwordResetValidationRules = passwordResetValidationRules;
const userValidationRules = () => [
    (0, express_validator_1.check)("username").notEmpty().withMessage("Username is required"),
    isEmail,
    isPassword,
];
exports.userValidationRules = userValidationRules;
const firstNameValidationRules = () => [
    isRequiredString("firstName", "Name must be a string"),
];
exports.firstNameValidationRules = firstNameValidationRules;
const lastNameValidationRules = () => [
    isRequiredString("lastName", "Name must be a string"),
];
exports.lastNameValidationRules = lastNameValidationRules;
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    next();
};
exports.validate = validate;
