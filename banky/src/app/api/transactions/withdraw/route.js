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
  if (!user || user.balance < amount) {
    return new Response(JSON.stringify({ success: false, message: "Insufficient funds" }), { status: 400 });
  }

  user.balance -= amount;

await Transaction.create({
  user: user._id,
  type: "withdraw",
  amount,
});

  await user.save();

  return new Response(JSON.stringify({ success: true, balance: user.balance }), { status: 200 });
}
