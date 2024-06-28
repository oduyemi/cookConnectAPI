import mongoose, { Connection } from "mongoose";
import session from 'express-session';
import MongoDBSessionStore from 'connect-mongodb-session';
require('dotenv').config();

const mongoDBURI: string = process.env.MONGODB_URI !== undefined ? process.env.MONGODB_URI : "mongodb://127.0.0.1:27017/cookconnectdb";

mongoose
  .connect(mongoDBURI)
  .catch((e: Error) => {
    console.error("MongoDB connection error:", e.message);
    process.exit(1); 
  });

const db: Connection = mongoose.connection;

db.on("error", (error: any) => { 
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});


const MongoDBStore = MongoDBSessionStore(session);
const store = new MongoDBStore({
  uri: mongoDBURI,
  collection: 'sessions' 
});

store.on('error', function(error: any) { 
  console.error('Session Store Error:', error);
});

export { db, store };
