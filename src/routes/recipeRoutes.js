"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const recipeController_1 = require("../controllers/recipeController");
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, uploadMiddleware_1.default.single('img'), recipeController_1.createRecipe);
router.get('/', recipeController_1.getAllRecipe);
router.get('/:recipeId', recipeController_1.getRecipeById);
router.put('/:recipeId', authMiddleware_1.protect, uploadMiddleware_1.default.single('img'), recipeController_1.updateRecipe);
router.delete('/:recipeId', authMiddleware_1.protect, recipeController_1.deleteRecipe);
exports.default = router;
