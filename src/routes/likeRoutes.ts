import express from 'express';
import { likeRecipe, unlikeRecipe } from '../controllers/likeController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/like/:recipeId', protect, likeRecipe);
router.delete('/unlike/:recipeId', protect, unlikeRecipe);

export default router;
