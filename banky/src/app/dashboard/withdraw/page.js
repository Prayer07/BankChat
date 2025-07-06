'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
jjjjjj
  const handleWithdraw = async () => {
    const token = sessionStorage.getItem("token");
    const res = await fetch("/api/transactions/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: Number(amount) }),
    });

    const data = await res.json();
    setMessage(data.success ? "Withdrawal successful!" : data.message);
    if (data.success){
      setAmount("");
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 flex flex-col items-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-4">➖ Withdraw</h1>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleWithdraw}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Withdraw
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-blue-500 underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
