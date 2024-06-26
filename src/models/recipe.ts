import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    desc: string;
    ingredients: string[];
    instructions: string;
    img?: string;
    author: mongoose.Types.ObjectId;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const recipeSchema: Schema<IRecipe> = new Schema({
  title: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },

  ingredients: {
    type: [String],
    required: true,
  },

  instructions: {
    type: String,
    required: true,
  },

  img: {
    type: String,
    required: true,
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
export default Recipe;