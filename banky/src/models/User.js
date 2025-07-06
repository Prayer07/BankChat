// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/, // only 10-digit numbers
  },
  password: { type: String, required: true, minlength: 6 },
    balance: { type: Number, default: 0 }, // 💸 balance field

}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
