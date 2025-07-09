"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Expense = {
  id: string;
  title: string;
  amount: number;
  paymentmethod: string;
  category: string;
  expenseAt: string; // ISO date string
};

export default function TransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/getTransactions");
        if (!res.ok) throw new Error("Failed to fetch expenses");
        const json = await res.json();
        const expenses = json.data;

        // Sort by date descending
       
        setTransactions(expenses);
       

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const deleteExpense = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/expense`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenseId: id }),
      });

      if (!res.ok) throw new Error("Failed to delete transaction");

      // Remove from UI
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
    } catch (error) {
      console.error(error);
      alert("Could not delete transaction.");
    }
  };
 const deleteIncome = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/income`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ incomeId: id }),
      });

      if (!res.ok) throw new Error("Failed to delete transaction");

      // Remove from UI
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
    } catch (error) {
      console.error(error);
      alert("Could not delete transaction.");
    }
  };



  if (loading) {
    return <div className="p-4 text-gray-500">Loading transactions...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Your Transactions
      </h1>

      {/* Toolbar with Add buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard/expenses")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add Expense
        </button>
        <button
          onClick={() => router.push("/dashboard/incomes")}
          className="bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition"
        >
          Add Income
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) :  (
       <ul className="space-y-3">
  {transactions.map((txn) =>
    txn.type === "expense" ? (
      <li
        key={txn.id}
        className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition flex justify-between items-center bg-white"
      >
        {/* Left side */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{txn.title}</h2>
          <p className="text-sm text-gray-500">{txn.category}</p>
          <p className="text-xs text-gray-400">
            {new Date(txn.expenseAt).toLocaleString()}
          </p>
        </div>

        {/* Right side: amount + delete button */}
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold text-red-600">
            ₹{txn.amount.toFixed(2)}
          </p>
          <button
            onClick={() => deleteExpense(txn.id)}
            className="px-3 py-1.5 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Delete
          </button>
        </div>
      </li>
    ) : (
      <li
        key={txn.id}
        className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition flex justify-between items-center bg-white"
      >
        {/* Left side */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{txn.title}</h2>
          <p className="text-sm text-gray-500">{txn.category}</p>
          <p className="text-xs text-gray-400">
            {new Date(txn.incomeAt).toLocaleString()}
          </p>
        </div>

        {/* Right side: amount + delete button */}
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold text-green-600">
            ₹{txn.amount.toFixed(2)}
          </p>
          <button
            onClick={() => deleteIncome(txn.id)}
            className="px-3 py-1.5 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Delete
          </button>
        </div>
      </li>
    )
  )}
</ul>

      )}
    </div>
  );
}
