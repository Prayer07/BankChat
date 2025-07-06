'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const typeIcons = {
  add: "➕",
  withdraw: "➖",
  transfer: "🔁",
};

const typeColors = {
  add: "bg-green-100 text-green-800",
  withdraw: "bg-yellow-100 text-yellow-800",
  transfer: "bg-blue-100 text-blue-800",
};

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return router.push("/login");

    const fetchHistory = async () => {
      const res = await fetch("/api/transactions/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) return router.push("/login");

      setHistory(data.history);
      setLoading(false);
    };

    fetchHistory();
  });

  useEffect(() => {
    let filteredData = [...history];

    if (filter !== "all") {
      filteredData = filteredData.filter(tx => tx.type === filter);
    }

    if (search) {
      filteredData = filteredData.filter(tx =>
        tx.to?.includes(search)
      );
    }

    setFiltered(filteredData);
  }, [filter, search, history]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 p-6 bg-gray-100 flex flex-col items-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">📜 Transaction History</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <select
            className="border p-2 rounded w-full md:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="add">Add</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
          </select>

          <input
            type="text"
            placeholder="Search by phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No matching transactions</p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((tx) => (
              <li
                key={tx._id}
                className={`p-4 rounded-lg border ${typeColors[tx.type]} flex justify-between items-start`}
              >
                <div>
                  <p className="text-lg font-semibold">
                    {typeIcons[tx.type]} {tx.type.toUpperCase()}
                  </p>
                  <p>Amount: ₦{tx.amount.toLocaleString()}</p>
                  {tx.to && <p>To: {tx.to}</p>}
                  <p className="text-xs text-gray-600">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 text-blue-500 underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
