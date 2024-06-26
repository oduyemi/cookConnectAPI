import mongoose, { Document, Schema } from "mongoose";

export interface IFollow extends Document {
    _id: mongoose.Types.ObjectId;
    follower: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId;
    createdAt: Date;
}

const followSchema: Schema<IFollow> = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  following: {
    ype: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }

});

const Follow = mongoose.model<IFollow>("Follow", followSchema);
export default Follow;