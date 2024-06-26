"use strict";
// controllers/likeController.ts
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
exports.unlikeRecipe = exports.likeRecipe = void 0;
const like_1 = __importDefault(require("../models/like"));
const recipe_1 = __importDefault(require("../models/recipe"));
const likeRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipeId } = req.params;
        const userId = req.session.user.userID;
        const like = yield like_1.default.findOne({ user: userId, recipe: recipeId });
        if (like) {
            return res.status(400).json({ message: 'Recipe already liked' });
        }
        const newLike = new like_1.default({ user: userId, recipe: recipeId });
        yield newLike.save();
        yield recipe_1.default.findByIdAndUpdate(recipeId, { $inc: { likesCount: 1 } });
        res.status(201).json({ message: 'Recipe liked' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.likeRecipe = likeRecipe;
const unlikeRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipeId } = req.params;
        const userId = req.session.user.userID;
        const like = yield like_1.default.findOne({ user: userId, recipe: recipeId });
        if (!like) {
            return res.status(400).json({ message: 'Recipe not liked yet' });
        }
        yield like_1.default.deleteOne({ _id: like._id });
        yield recipe_1.default.findByIdAndUpdate(recipeId, { $inc: { likesCount: -1 } });
        res.status(200).json({ message: 'Recipe unliked' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.unlikeRecipe = unlikeRecipe;
