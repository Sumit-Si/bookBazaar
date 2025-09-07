import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  try {
    const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

    await mongoose.connect(uri);
    console.log("Connected ✅");
  } catch (error) {
    console.log("Disconnected ❌", error);
    process.exit();
  }
};

export default dbConnect;
