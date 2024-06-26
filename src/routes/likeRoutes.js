"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likeController_1 = require("../controllers/likeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/like/:recipeId', authMiddleware_1.protect, likeController_1.likeRecipe);
router.delete('/unlike/:recipeId', authMiddleware_1.protect, likeController_1.unlikeRecipe);
exports.default = router;
