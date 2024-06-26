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
exports.deleteRecipe = exports.updateRecipe = exports.getRecipeById = exports.getAllRecipe = exports.createRecipe = void 0;
const mongoose_1 = require("mongoose");
const recipe_1 = __importDefault(require("../models/recipe"));
const cloudinary_1 = require("cloudinary");
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, desc, ingredients, instructions, author, img } = req.body;
        if (![title, desc, ingredients, instructions, author, img].every(field => field)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(img, {
            folder: "recipe-images/",
            width: 300,
            crop: "scale"
        });
        const newRecipeData = {
            title,
            desc,
            ingredients,
            instructions,
            author,
            img: cloudinaryResponse.secure_url,
            createdAt: new Date(),
        };
        const newRecipe = new recipe_1.default(newRecipeData);
        const savedRecipe = yield newRecipe.save();
        return res.status(201).json({ message: "Recipe created successfully", data: savedRecipe });
    }
    catch (error) {
        console.error("Error during recipe creation:", error);
        return res.status(500).json({ message: "Error creating recipe" });
    }
});
exports.createRecipe = createRecipe;
const getAllRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield recipe_1.default.find();
        if (recipes.length === 0) {
            return res.status(404).json({ message: "Recipes not available" });
        }
        else {
            return res.json({ data: recipes });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllRecipe = getAllRecipe;
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = req.params.recipeId;
        const recipe = yield recipe_1.default.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        else {
            return res.json({ data: recipe });
        }
    }
    catch (error) {
        console.error("Error fetching data from the database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getRecipeById = getRecipeById;
const updateRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = req.params.recipeId;
        const updatedRecipeData = req.body;
        const requiredFields = ["title", "desc", "ingredients", "instructions", "author", "img"];
        const missingFields = requiredFields.filter(field => !(field in updatedRecipeData));
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }
        const updatedRecipe = yield recipe_1.default.findByIdAndUpdate(recipeId, updatedRecipeData, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        return res.json({ data: updatedRecipe });
    }
    catch (error) {
        console.error("Error updating recipe", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateRecipe = updateRecipe;
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = req.params.recipeId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        const recipe = yield recipe_1.default.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        const recipeUserID = mongoose_1.Types.ObjectId.isValid(recipe.author) ? recipe.author.toString() : recipe.author;
        if (recipeUserID !== req.session.user.userID) {
            return res.status(401).json({ message: "Unauthorized: User not authorized to delete this recipe" });
        }
        yield recipe_1.default.findByIdAndDelete(recipeId);
        return res.status(200).json({ message: "Recipe deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting recipe:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteRecipe = deleteRecipe;
