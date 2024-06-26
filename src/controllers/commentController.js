"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentsByRecipeId = exports.createComment = void 0;
const comment_1 = __importDefault(require("../models/comment"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipeId } = req.params;
        const { text } = req.body;
        const userId = req.session.user.userID;
        const newComment = new comment_1.default({
            text,
            createdBy: userId,
            recipe: recipeId,
        });
        yield newComment.save();
        res.status(201).json({ message: 'Comment added', comment: newComment });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createComment = createComment;
const getCommentsByRecipeId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipeId } = req.params;
        const comments = yield comment_1.default.find({ recipe: recipeId })
            .populate('createdBy', '_id username')
            .sort({ createdAt: -1 });
        res.json(comments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCommentsByRecipeId = getCommentsByRecipeId;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = req.session.user.userID;
        const comment = yield comment_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.commentAuthor.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this comment' });
        }
        comment.text = text;
        yield comment.save();
        res.json({ message: 'Comment updated', comment });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const userId = req.session.user.userID;
        const comment = yield comment_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.commentAuthor.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }
        yield comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteComment = deleteComment;
