import express from 'express';
import { userAuthMiddleware } from '../controllers/authController';
import { createRecipe, getAllRecipe, getRecipeById, updateRecipe, deleteRecipe } from '../controllers/recipeController';

const router = express.Router();


router.post('/recipes', userAuthMiddleware, createRecipe);
router.get('/recipes', getAllRecipe);
router.get('/recipes/:recipeId', getRecipeById);
router.put('/recipes/:recipeId', userAuthMiddleware, updateRecipe);
router.delete('/recipes/:recipeId', userAuthMiddleware, deleteRecipe);

export default router;
