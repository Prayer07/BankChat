// lib/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

    console.log("🔍 URI:", process.env.MONGODB_URI);


export async function connectDB() {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "banky",
    });
    console.log("✅ MongoDB connected ");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
