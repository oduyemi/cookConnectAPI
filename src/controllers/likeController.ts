// controllers/likeController.ts

import { Request, Response } from 'express';
import Like from '../models/like';
import Recipe from '../models/recipe';

export const likeRecipe = async (req: Request, res: Response) => {
    try {
        const { recipeId } = req.params;
        const userId = req.session.user!.userID;

        const like = await Like.findOne({ user: userId, recipe: recipeId });

        if (like) {
            return res.status(400).json({ message: 'Recipe already liked' });
        }

        const newLike = new Like({ user: userId, recipe: recipeId });
        await newLike.save();

        await Recipe.findByIdAndUpdate(recipeId, { $inc: { likesCount: 1 } });

        res.status(201).json({ message: 'Recipe liked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const unlikeRecipe = async (req: Request, res: Response) => {
    try {
        const { recipeId } = req.params;
        const userId = req.session.user!.userID;

        const like = await Like.findOne({ user: userId, recipe: recipeId });

        if (!like) {
            return res.status(400).json({ message: 'Recipe not liked yet' });
        }

        await Like.deleteOne({ _id: like._id });

        await Recipe.findByIdAndUpdate(recipeId, { $inc: { likesCount: -1 } });

        res.status(200).json({ message: 'Recipe unliked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
