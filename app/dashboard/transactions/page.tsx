"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchCategories from "@/hooks/category/useFetchCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
  const [categoryId, setCategoryId] = useState("");
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
      console.log(json.data);
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
      ...(categoryId && { categoryId: categoryId }),
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
    <div className="min-h-screen w-full p-0 m-0 bg-[#181f2a] flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-white tracking-tight">Your Transactions</h1>

        {/* Add Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/dashboard/expenses")}
            className="bg-[#22c55e] text-white px-6 py-2 rounded-full font-bold shadow transition text-base tracking-wide hover:bg-[#16a34a]"
          >
            Add Expense
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/dashboard/incomes")}
            className="bg-[#38bdf8] text-white px-6 py-2 rounded-full font-bold shadow transition text-base tracking-wide hover:bg-[#2563eb]"
          >
            Add Income
          </motion.button>
        </div>

        {/* Filter Form */}
        <form
          onSubmit={handleFilter}
          className="bg-[#181f2a]/80 border border-[#232b45] rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 backdrop-blur-xl"
        >
          {/* Dates – always visible */}
          <div>
            <label className="block text-xs font-semibold text-[#b6c2e2] mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-[#232b45] rounded-lg p-2 w-full bg-[#232b45]/60 text-white focus:ring-2 focus:ring-[#38bdf8] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#b6c2e2] mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-[#232b45] rounded-lg p-2 w-full bg-[#232b45]/60 text-white focus:ring-2 focus:ring-[#38bdf8] outline-none"
            />
          </div>

          {/* Show for expense or all */}
          {(type === "expense" || type === "") && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#b6c2e2] mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="border border-[#232b45] rounded-lg p-2 w-full bg-[#232b45]/60 text-white focus:ring-2 focus:ring-[#38bdf8] outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#b6c2e2] mb-1">Payment Method</label>
                <select
                  value={paymentmethod}
                  onChange={(e) => setpaymentmethod(e.target.value)}
                  className="border border-[#232b45] rounded-lg p-2 w-full bg-[#232b45]/60 text-white focus:ring-2 focus:ring-[#6366f1] outline-none"
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
              <label className="block text-xs font-semibold text-[#b6c2e2] mb-1">Income Source</label>
              <select
                value={incomesource}
                onChange={(e) => setincomesource(e.target.value)}
                className="border border-[#232b45] rounded-lg p-2 w-full bg-[#232b45]/60 text-white focus:ring-2 focus:ring-[#38bdf8] outline-none"
              >
                <option value="">All</option>
                <option value="salary">Salary</option>
                {/* Add more options if needed */}
              </select>
            </div>
          )}

          {/* Type – always visible */}
          <div>
            <label className="block text-xs font-semibold text-[#b6c2e2] mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "" | "expense" | "income")}
              className="border border-[#232b45] rounded-lg p-2 w-full bg-[#232b45]/60 text-white focus:ring-2 focus:ring-[#38bdf8] outline-none"
            >
              <option value="">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-[#38bdf8] text-white rounded-full px-4 py-2 w-full font-bold shadow transition text-base tracking-wide hover:bg-[#2563eb]"
            >
              Apply Filters
            </motion.button>
          </div>
        </form>

        {/* Transactions List */}
        {loading ? (
          <p className="text-center text-[#b6c2e2]">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-[#b6c2e2]">No transactions found.</p>
        ) : (
          <ul className="space-y-6">
            {transactions.map((txn) => (
              <motion.li
                key={txn.id}
                whileHover={{
                  scale: 1.025,
                  borderColor: txn.type === 'expense' ? '#ef4444' : '#22c55e',
                }}
                className={`w-full transition-all duration-200 border border-[#232b45] bg-[#232b45] rounded-2xl flex flex-row justify-between items-center px-8 py-6 gap-6 shadow-xl`}
                style={{ boxShadow: '0 4px 24px #0008' }}
              >
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <h2 className="text-white font-bold text-lg md:text-xl truncate">{txn.title}</h2>
                  <p className="text-[#7dd3fc] text-xs md:text-sm font-medium truncate">{txn.category}</p>
                  <p className="text-[#94a3b8] text-xs md:text-sm truncate">
                    {new Date(txn.expenseAt ?? txn.incomeAt ?? "").toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 min-w-fit">
                  <p
                    className={`text-xl md:text-2xl font-bold ${
                      txn.type === "expense" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    ₹{txn.amount.toFixed(2)}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: [0, -15, 15, 0, 0], transition: { duration: 0.5, repeat: Infinity, repeatType: 'loop' } }}
                    whileTap={{ rotate: 180, scale: 1.2 }}
                    onClick={() => deleteTransaction(txn)}
                    className="p-2 rounded-full bg-[#232b45] hover:bg-[#ef4444]/20 transition flex items-center justify-center"
                    style={{ color: '#e0e7ef' }}
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
