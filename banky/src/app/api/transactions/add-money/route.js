import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const { amount } = await req.json();
  if (!amount || isNaN(amount) || amount <= 0) {
    return new Response(JSON.stringify({ success: false, message: "Invalid amount" }), { status: 400 });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
  }

  user.balance += amount;

    // Save transaction history
    await Transaction.create({
    user: user._id,
    type: "add",
    amount,
});

  await user.save();

  return new Response(JSON.stringify({ success: true, balance: user.balance }), { status: 200 });
}
