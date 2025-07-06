import { io } from "socket.io-client";

let socket;

export function initSocket() {
  socket = io({
    path: "/api/socket",
  });
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
}
