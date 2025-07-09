"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SummaryData = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
};

export default function Home() {
  const router = useRouter();
  const userName = "Harsh";

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [expensesRes, incomesRes] = await Promise.all([
          fetch("/api/getExpenses"),
          fetch("/api/getIncomes"),
        ]);

        const expensesData = await expensesRes.json();
        const incomesData = await incomesRes.json();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const expenses = expensesData.data.filter((e: any) => {
          const date = new Date(e.expenseAt);
          return (
            date.getMonth() === currentMonth && date.getFullYear() === currentYear
          );
        });

        const incomes = incomesData.data.filter((i: any) => {
          const date = new Date(i.incomeAt);
          return (
            date.getMonth() === currentMonth && date.getFullYear() === currentYear
          );
        });

        const totalExpense = expenses.reduce(
          (sum: number, e: any) => sum + e.amount,
          0
        );
        const totalIncome = incomes.reduce(
          (sum: number, i: any) => sum + i.amount,
          0
        );
        const netBalance = totalIncome - totalExpense;

        setSummary({ totalIncome, totalExpense, netBalance });
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-200">

       {/* Summary Section */}
      <section className="px-6 py-6 md:px-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          This Month's Summary
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading summary...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Total Income */}
            <div className="bg-green-100 rounded-xl p-4 text-center shadow">
              <p className="text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-700">
                ₹{summary?.totalIncome.toFixed(2)}
              </p>
            </div>

            {/* Total Expenses */}
            <div className="bg-red-100 rounded-xl p-4 text-center shadow">
              <p className="text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">
                ₹{summary?.totalExpense.toFixed(2)}
              </p>
            </div>

            {/* Net Balance */}
            <div
              className={`rounded-xl p-4 text-center shadow ${
                summary?.netBalance >= 0 ? "bg-blue-100" : "bg-yellow-100"
              }`}
            >
              <p className="text-gray-600">Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  summary?.netBalance >= 0
                    ? "text-blue-700"
                    : "text-yellow-700"
                }`}
              >
                ₹{summary?.netBalance.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Welcome Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-6 py-3 md:px-20 ">
        {/* Text Content */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Welcome back, <span className="text-blue-600">{userName}!</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Let’s keep track of your finances and stay on top of your goals.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push("/dashboard/transactions")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow"
            >
              View Transactions
            </button>
            <button
              onClick={() => router.push("/dashboard/expenses")}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition shadow"
            >
              Add Expense
            </button>
            <button
              onClick={() => router.push("/dashboard/incomes")}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition shadow"
            >
              Add Income
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="mb-8 md:mb-0">
          <img
            src="/ftmoney.svg"
            alt="Finance Illustration"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-center items-center py-4 bg-gray-50 border-t">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} WalletTrack. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
