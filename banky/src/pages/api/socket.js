import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("🔌 New socket connected:", socket.id);

      socket.on("join", ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      });

      socket.on("send-message", (msg) => {
        const { to, from, text } = msg;

        // Send to receiver only if they're in the room
        io.to(to).emit("receive-message", { from, text, timestamp: Date.now() });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
