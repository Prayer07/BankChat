// app/api/auth/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { validateSignup } from "@/utils/validate";

export async function POST(req) {
  try {
    await connectDB();
    const { fname, lname, phone, password } = await req.json();

    const { valid, errors } = validateSignup({ fname, lname, phone, password });

    if (!valid) {
      return new Response(JSON.stringify({ success: false, errors }), { status: 400 });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return new Response(JSON.stringify({ success: false, message: "Phone already exists" }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fname,
      lname,
      phone,
      password: hashedPassword,
    });

    return new Response(JSON.stringify({ success: true, message: "User registered" }), { status: 201 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: "Signup failed" }), { status: 500 });
  }
}
