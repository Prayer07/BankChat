// File: app/api/auth/me/route.js
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) return new Response(JSON.stringify({ success: false }), { status: 401 });

  const user = await User.findById(decoded.id);
  return new Response(JSON.stringify({ success: true, user }), { status: 200 });
}
