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

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
        try {
        const res = await fetch("/api/getTransactions");
        if (!res.ok) throw new Error("Failed to fetch expenses");
        const json = await res.json();
        const expenses = json.data; // <-- access the array directly

        // Sort by expenseAt descending
        const sorted = expenses.sort(
            (a: Expense, b: Expense) => new Date(b.expenseAt).getTime() - new Date(a.expenseAt).getTime()
        );

        setTransactions(sorted);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    };

    fetchExpenses();
    }, []);


  if (loading) {
    return <div className="p-4 text-gray-500">Loading transactions...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((txn) => (
            <li
              key={txn.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{txn.title}</h2>
                  <p className="text-sm text-gray-500">{txn.category}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(txn.expenseAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ₹{txn.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{txn.paymentmethod}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
