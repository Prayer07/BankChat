// app/api/auth/login/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  try {
    const { phone, password } = await req.json();

    if (!/^\d{10}$/.test(phone) || !/^\d{6}$/.test(password)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid credentials format" }), { status: 400 });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ success: false, message: "Incorrect password" }), { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, fname: user.fname, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return new Response(JSON.stringify({ success: true, token, fname: user.fname }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Login failed" }), { status: 500 });
  }
}
