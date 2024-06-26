import { Request, Response, NextFunction } from 'express';
import { validationResult, check } from 'express-validator';

// Validation rules for password reset
export const passwordResetValidationRules = () => [
    check('email').isEmail().withMessage('Must be a valid email'),
    check('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Middleware to validate input
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
