// app/api/user/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return new Response(JSON.stringify({ success: false, message: "Token missing" }), { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 401 });
  }

  const user = await User.findById(decoded.id).select("fname balance");
  return new Response(JSON.stringify({ success: true, user }), { status: 200 });
}
