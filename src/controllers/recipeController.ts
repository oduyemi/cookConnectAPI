import { Request, Response } from 'express';
import { Types } from "mongoose";
import Recipe, { IRecipe } from '../models/recipe';
import path from 'path';
import fs from 'fs';


export const createRecipe = async (req: Request, res: Response) => {
    try {
        const { title, description, ingredients, instructions, author } = req.body;
        let imgPath: string | undefined;

        if (req.file) {
            imgPath = req.file.path;
        } else {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        const newRecipe = await Recipe.create({
            title,
            description,
            ingredients,
            instructions,
            author,
            image: imgPath
        });

        res.status(201).json({ recipe: newRecipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create recipe.' });
    }
};



export const getAllRecipe = async (req: Request, res: Response) => {
    try {
        const recipes: IRecipe[] = await Recipe.find();
        if (recipes.length === 0) {
            return res.status(404).json({ message: "Recipes not available" });
        } else {
            return res.json({ data: recipes });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getRecipeById = async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.recipeId;
        const recipe: IRecipe | null = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        } else {
            return res.json({ data: recipe });
        }
    } catch (error) {
        console.error("Error fetching data from the database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateRecipe = async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.recipeId;
        const updatedRecipeData: Partial<IRecipe> = req.body;

        const requiredFields = ["title", "desc", "ingredients", "instructions", "author", "img"];
        const missingFields = requiredFields.filter(field => !(field in updatedRecipeData));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updatedRecipeData, { new: true });

        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        return res.json({ data: updatedRecipe });
    } catch (error) {
        console.error("Error updating recipe", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteRecipe = async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.recipeId;
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const recipeUserID = Types.ObjectId.isValid(recipe.author) ? recipe.author.toString() : recipe.author;
        if (recipeUserID !== req.session.user.userID) {
            return res.status(401).json({ message: "Unauthorized: User not authorized to delete this recipe" });
        }

        await Recipe.findByIdAndDelete(recipeId);
        return res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
