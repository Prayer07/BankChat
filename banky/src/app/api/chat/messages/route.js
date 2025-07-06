import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import Message from "@/models/Message";

export async function GET(req) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);
  const url = new URL(req.url);
  const phone = url.searchParams.get("phone");

  if (!decoded) return new Response("Unauthorized", { status: 401 });

  const receiver = await User.findOne({ phone });
  if (!receiver) return new Response("User not found", { status: 404 });

  const messages = await Message.find({
    $or: [
      { sender: decoded.id, receiver: receiver._id },
      { sender: receiver._id, receiver: decoded.id },
    ],
  }).sort({ timestamp: 1 });

  return new Response(JSON.stringify(messages), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const token = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);
  const { text, toPhone, audio } = await req.json();

  if (!decoded) return new Response("Unauthorized", { status: 401 });

  const receiver = await User.findOne({ phone: toPhone });
  if (!receiver) return new Response("Receiver not found", { status: 404 });

  const newMsg = await Message.create({
    sender: decoded.id,
    receiver: receiver._id,
    text: text || "",
    audio: audio || "",
  });

  return new Response(JSON.stringify(newMsg), { status: 200 });
}

