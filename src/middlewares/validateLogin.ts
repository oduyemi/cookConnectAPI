import { Request, Response, NextFunction } from 'express';
import { validationResult, check } from 'express-validator';

export const loginValidationRules = () => {
    return [
        check('email').isEmail().withMessage('Must be a valid email'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
