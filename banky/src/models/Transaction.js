import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["add", "withdraw", "transfer"], required: true },
    amount: { type: Number, required: true },
    to: { type: String }, // receiver's phone (for transfers only)
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
