import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser }  from '../models/user';


interface DecodedToken {
    id: string;
}

declare global {
    namespace Express {
      interface Request {
        user?: IUser; 
      }
    }
}

export const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        if (!req.session.user || req.session.user.userID.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in or unauthorized to perform this action" })
        }

        const user = await User.findById(req.session.user.userID);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("Authentication message:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }
};



export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }

            req.user = user.toJSON() as IUser;

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};