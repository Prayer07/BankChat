import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const history = await Transaction.find({ user: decoded.id }).sort({ createdAt: -1 });

  return new Response(JSON.stringify({ success: true, history }), { status: 200 });
}
