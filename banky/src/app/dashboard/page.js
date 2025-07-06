'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return router.push("/login");

    const fetchUser = async () => {
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) return router.push("/login");

      setUser(data.user);
      sessionStorage.setItem("fname", data.user.fname);
    };

    fetchUser();
  });

  if (!user) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 flex flex-col items-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg text-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.fname} 👋</h1>
        <p className="text-xl text-gray-700">
          💰 Your Balance: <strong>₦{user.balance.toLocaleString()}</strong>
        </p>
      </div>

      <div className="w-full max-w-lg space-y-4">
        <button
          onClick={() => router.push("/dashboard/add")}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          ➕ Add Money
        </button>
        <button
          onClick={() => router.push("/dashboard/withdraw")}
          className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600"
        >
          ➖ Withdraw Money
        </button>
        <button
          onClick={() => router.push("/dashboard/transfer")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          🔁 Transfer Money
        </button>
        <button
          onClick={() => router.push("/dashboard/history")}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
        >
          📜 Transaction History
        </button>
        <button
          onClick={() => router.push("/chat")}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
        >
          💬 Chat
        </button>
      </div>
    </div>
  );
}
