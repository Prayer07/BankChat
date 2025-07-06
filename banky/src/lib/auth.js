// lib/auth.js
import jwt from "jsonwebtoken";

    console.log("jwt secret key " + process.env.JWT_SECRET)


export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}