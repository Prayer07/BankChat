'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const typeLabels = {
  add: "Money Added",
  withdraw: "Money Withdrawn",
  transfer: "Money Transferred",
};

const typeIcons = {
  add: "🟢",
  withdraw: "🟡",
  transfer: "🔵",
};

export default function ReceiptPage() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return router.push("/login");

    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/transactions/receipt/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) {
          setReceipt(data.transaction);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to load receipt.");
      }
    };

    fetchReceipt();
  }, [id, router]);

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!receipt) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="text-4xl mb-4">{typeIcons[receipt.type]}</div>
        <h1 className="text-2xl font-bold mb-2">{typeLabels[receipt.type]}</h1>
        <p className="text-gray-600 mb-4">
          Transaction ID: <code className="text-sm">{receipt._id}</code>
        </p>
        <p className="text-xl font-semibold text-gray-800 mb-2">
          Amount: ₦{receipt.amount.toLocaleString()}
        </p>
        {receipt.to && <p>Sent To: <strong>{receipt.to}</strong></p>}
        <p className="text-sm text-gray-500 mt-4">
          Date: {new Date(receipt.createdAt).toLocaleString()}
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 text-blue-500 underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
