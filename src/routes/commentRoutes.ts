import express from 'express';
import { createComment, getCommentsByRecipeId, updateComment, deleteComment } from '../controllers/commentController';
import { userAuthMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/:recipeId', userAuthMiddleware, createComment);
router.get('/:recipeId', getCommentsByRecipeId);
router.put('/:commentId', userAuthMiddleware, updateComment);
router.delete('/:commentId', userAuthMiddleware, deleteComment);

export default router;
