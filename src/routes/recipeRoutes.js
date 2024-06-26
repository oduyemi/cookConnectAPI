"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const recipeController_1 = require("../controllers/recipeController");
const router = express_1.default.Router();
router.post('/recipes', authController_1.userAuthMiddleware, recipeController_1.createRecipe);
router.get('/recipes', recipeController_1.getAllRecipe);
router.get('/recipes/:recipeId', recipeController_1.getRecipeById);
router.put('/recipes/:recipeId', authController_1.userAuthMiddleware, recipeController_1.updateRecipe);
router.delete('/recipes/:recipeId', authController_1.userAuthMiddleware, recipeController_1.deleteRecipe);
exports.default = router;
