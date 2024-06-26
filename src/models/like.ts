import mongoose, { Document, Schema } from "mongoose";

export interface ILike extends Document {
    _id: mongoose.Types.ObjectId;
    likeAuthor: mongoose.Types.ObjectId;
    recipe: mongoose.Types.ObjectId;
    createdAt: Date;
}

const likeSchema: Schema<ILike> = new Schema({
  likeAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  recipe: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }

});

const Like = mongoose.model<ILike>("Like", likeSchema);
export default Like;