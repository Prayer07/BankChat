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

  const { amount, toPhone } = await req.json();
  if (!amount || isNaN(amount) || amount <= 0 || !/^\d{10}$/.test(toPhone)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid input" }), { status: 400 });
  }

  const sender = await User.findById(decoded.id);
  const receiver = await User.findOne({ phone: toPhone });

  if (!receiver) {
    return new Response(JSON.stringify({ success: false, message: "Receiver not found" }), { status: 404 });
  }

  if (sender.phone === toPhone) {
    return new Response(JSON.stringify({ success: false, message: "Cannot transfer to yourself" }), { status: 400 });
  }

  if (sender.balance < amount) {
    return new Response(JSON.stringify({ success: false, message: "Insufficient balance" }), { status: 400 });
  }

  sender.balance -= amount;
  receiver.balance += amount;

await Transaction.create({
  user: sender._id,
  type: "transfer",
  amount,
  to: receiver.phone,
});

  await sender.save();
  await receiver.save();

  // Respond with transaction ID (for receipt)
return new Response(JSON.stringify({
  success: true,
  balance: sender.balance,
  receiver: receiver.fname,
  receiptId: transaction._id, // 🧾 key part
}), { status: 200 });
}
