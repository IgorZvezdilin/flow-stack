import mongoose from "mongoose";

let isConnected = false;
export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) return console.error("MISSING MONGODB URL");
  if (isConnected) return console.log("Mongodb is already connected");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "dev-overflow",
    });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (e) {
    console.error(`MongoDb connection failed: ${e}`);
  }
};
