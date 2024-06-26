import mongoose, { Connection } from "mongoose";
require('dotenv').config();


const mongoDB: string = process.env.MONGODB_URI !== undefined ? process.env.MONGODB_URI : "mongodb://127.0.0.1:27017/cookconnectdb";



mongoose
  .connect(mongoDB)
  .catch((e: Error) => {
    console.error("connection-error", e.message);
  });

const db: Connection = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default db;