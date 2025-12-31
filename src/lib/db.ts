import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  await mongoose.connect(MONGODB_URI);
  return mongoose;
}
