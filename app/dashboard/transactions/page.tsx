"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchCategories from "@/hooks/category/useFetchCategories";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  paymentmethod?: string;
  category: string;
  expenseAt?: string;
  incomeAt?: string;
  type: "expense" | "income";
};

export default function TransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { categories } = fetchCategories();

  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"" | "expense" | "income">("");
  const [incomesource, setincomesource] = useState("");
  const [paymentmethod, setpaymentmethod] = useState("");

  useEffect(() => {
    fetchTransactions();
   
  }, []);

  const fetchTransactions = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await fetch("/api/getTransactions/specificTransactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!res.ok) throw new Error("Failed to fetch transactions");

      const json = await res.json();
      const normalized = json.data.map((txn: any) => ({
        ...txn,
        type: txn.expenseAt ? "expense" : "income",
      }));

      setTransactions(normalized);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: any = {
      ...(startDate && { date1: startDate }),
      ...(endDate && { date2: endDate }),
      ...(category && { category }),
      ...(type && { type }),
      ...(incomesource && { incomesource }),
      ...(paymentmethod && { paymentmethod }),
    };

    fetchTransactions(filters);
  };

  const deleteTransaction = async (txn: Transaction) => {
    const confirmed = confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      const endpoint = txn.type === "expense" ? "/api/expense/manage" : "/api/income/manage";
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`${txn.type}Id`]: txn.id }),
      });

      if (!res.ok) throw new Error("Failed to delete transaction");

      setTransactions((prev) => prev.filter((t) => t.id !== txn.id));
    } catch (error) {
      console.error(error);
      alert("Could not delete transaction.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Transactions
      </h1>

      {/* Add Buttons */}
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

      {/* Filter Form */}
      <form
        onSubmit={handleFilter}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Dates – always visible */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {/* Show for expense or all */}
        {(type === "expense" || type === "") && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
              <select
                value={paymentmethod}
                onChange={(e) => setpaymentmethod(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="">All</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
          </>
        )}

        {/* Show for income or all */}
        {(type === "income" || type === "") && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Income Source</label>
            <select
              value={incomesource}
              onChange={(e) => setincomesource(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            >
              <option value="">All</option>
              <option value="salary">Salary</option>
              {/* Add more options if needed */}
            </select>
          </div>
        )}

        {/* Type – always visible */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "" | "expense" | "income")}
            className="border border-gray-300 rounded-lg p-2 w-full"
          >
            <option value="">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <button
            type="submit"
            className="bg-black text-white rounded-lg px-4 py-2 w-full hover:bg-gray-800 transition"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Transactions List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((txn) => (
            <li
              key={txn.id}
              className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition flex justify-between items-center bg-white"
            >
              {/* Left side */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{txn.title}</h2>
                <p className="text-sm text-gray-500">{txn.category}</p>
                <p className="text-xs text-gray-400">
                  {new Date(txn.expenseAt ?? txn.incomeAt ?? "").toLocaleString()}
                </p>
            
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                <p
                  className={`text-lg font-bold ${
                    txn.type === "expense" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ₹{txn.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => deleteTransaction(txn)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
