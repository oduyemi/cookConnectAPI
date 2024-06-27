import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";


// Reusable validation rules
const isEmail = check("email").isEmail().withMessage("Must be a valid email");
const isPassword = check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long");
const isRequiredString = (field: string, message: string) => check(field).isString().withMessage(message).notEmpty().withMessage(`${field} is required`);


const loginValidationRules = () => [
    isEmail,
    isPassword,
];

const passwordResetValidationRules = () => [
    isEmail,
    check("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const userValidationRules = () => [
    isEmail,
    isPassword,
];

const firstNameValidationRules = () => [
    isRequiredString("firstName", "Name must be a string"),
];

const lastNameValidationRules = () => [
    isRequiredString("lastName", "Name must be a string"),
];




const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    next();
};

export {
    loginValidationRules,
    passwordResetValidationRules,
    userValidationRules,
    firstNameValidationRules,
    lastNameValidationRules,
    validate,
};