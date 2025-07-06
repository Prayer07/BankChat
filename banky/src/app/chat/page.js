'use client'
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { initSocket, getSocket } from "@/lib/socket";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [toPhone, setToPhone] = useState("");
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("");
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize socket + join
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return router.push("/login");

    const getUserId = async () => {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUserId(data.user._id);

        const sock = initSocket();
        sock.emit("join", { userId: data.user._id });
        setSocket(sock);

        sock.on("receive-message", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      }
    };

    getUserId();
  }, [router]);

  const fetchHistory = async () => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`/api/chat/messages?phone=${toPhone}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  const handleSend = async () => {
    if (!text.trim() || !toPhone) return;

    const token = sessionStorage.getItem("token");
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, toPhone }),
    });

    const msg = await res.json();

    // Send via socket
    socket.emit("send-message", {
      from: userId,
      to: msg.receiver,
      text: msg.text,
    });

    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="bg-blue-700 text-white py-4 px-6 text-xl font-semibold shadow">
        💬 Chat
      </div>

      {/* Chat to input */}
      <div className="p-4 flex gap-2 bg-white shadow">
        <input
          placeholder="Enter phone number to chat with"
          value={toPhone}
          onChange={(e) => setToPhone(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button onClick={fetchHistory} className="bg-blue-700 text-white px-4 py-2 rounded">
          Load
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs p-3 rounded-lg shadow text-white ${
              msg.sender === userId
                ? "bg-blue-600 self-end ml-auto"
                : "bg-gray-600 self-start mr-auto"
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-right opacity-70 mt-1">
              {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleSend}
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
