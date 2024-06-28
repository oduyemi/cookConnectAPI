import mongoose, { Document, Schema } from "mongoose";
import { IRecipe } from './recipe';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio?: string;
  img?: string;
  createdAt: Date;
  lastLogin: Date;
  resetToken?: string | null;
  resetExpires?: Date | null;
  updatedAt: Date;
  recipes: IRecipe['_id'][];
}

const userSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: (password: string) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\s]).{8,}$/.test(password),
      message: "Password must be at least 8 characters long and contain at least one capital letter, one small letter, one digit, and one special character.",
    },
  },

  bio: {
    type: String,
  },

  img: {
    type: String,
  },

  resetToken: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  resetExpires: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastLogin: {
    type: Date,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  recipes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Recipe' 
  }]
  
});


userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
