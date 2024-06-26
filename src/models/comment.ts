import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    text: string;
    commentAuthor: mongoose.Types.ObjectId;
    recipe: mongoose.Types.ObjectId;
    createdAt: Date;
}

const commentSchema: Schema<IComment> = new Schema({
  text: {
    type: String,
    required: true,
  },

  commentAuthor: {
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

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;