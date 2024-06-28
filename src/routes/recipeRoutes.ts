import express from 'express';
import { protect } from "../middlewares/authMiddleware";
import { createRecipe, getAllRecipe, getRecipeById, updateRecipe, deleteRecipe } from '../controllers/recipeController';
import upload from '../middlewares/uploadMiddleware';

const router = express.Router();

router.post('/', protect, upload.single('img'), createRecipe);
router.get('/', getAllRecipe);
router.get('/:recipeId', getRecipeById);
router.put('/:recipeId', protect, upload.single('img'), updateRecipe);
router.delete('/:recipeId', protect, deleteRecipe);

export default router;
