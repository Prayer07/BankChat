import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const transaction = await Transaction.findById(params.id).lean();
  if (!transaction || transaction.user.toString() !== decoded.id) {
    return new Response(JSON.stringify({ success: false, message: "Not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, transaction }), { status: 200 });
}
