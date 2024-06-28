import { Request, Response } from 'express';
import User from '../models/user';
import Recipe from '../models/recipe';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ResourceApiResponse } from 'cloudinary';



export const getIndex = async (req: Request, res: Response) => {
    res.json({ message: "CookConnect API" });     
}


export const loginUser = async (req: Request,  res: Response) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const payload = {
        userId: user._id,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  
      const userSession = {
        userID: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        img: user.img,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        updatedAt: user.updatedAt
      };
  
      req.session.user = userSession;
  
      res.json({ token, user: userSession });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};
  
  

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.session.user!.userID).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password').populate({
            path: 'recipes', 
            model: Recipe, 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
