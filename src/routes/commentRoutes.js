"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/:recipeId', authMiddleware_1.userAuthMiddleware, commentController_1.createComment);
router.get('/:recipeId', commentController_1.getCommentsByRecipeId);
router.put('/:commentId', authMiddleware_1.userAuthMiddleware, commentController_1.updateComment);
router.delete('/:commentId', authMiddleware_1.userAuthMiddleware, commentController_1.deleteComment);
exports.default = router;
