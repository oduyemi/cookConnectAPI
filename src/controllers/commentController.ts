import { Request, Response } from 'express';
import Comment from '../models/comment';


export const createComment = async (req: Request, res: Response) => {
    try {
        const { recipeId } = req.params;
        const { text } = req.body;
        const userId = req.session.user!.userID;

        const newComment = new Comment({
            text,
            createdBy: userId,
            recipe: recipeId,
        });

        await newComment.save();

        res.status(201).json({ message: 'Comment added', comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCommentsByRecipeId = async (req: Request, res: Response) => {
    try {
        const { recipeId } = req.params;

        const comments = await Comment.find({ recipe: recipeId })
            .populate('createdBy', '_id author')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = req.session.user!.userID;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.commentAuthor.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this comment' });
        }

        comment.text = text;
        await comment.save();

        res.json({ message: 'Comment updated', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const userId = req.session.user!.userID;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.commentAuthor.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
