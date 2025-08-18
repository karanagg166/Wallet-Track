"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import OverviewLineChart from "@/components/charts/linecharts/overviewLineChart";
import DonutChart from "@/components/charts/donutcharts/DonutChart";

export default function OverviewPage() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState<"expense" | "income" | "both">("both");

  const savings = totalIncome - totalExpenses;

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const fromDate = `${currentYear}-01-01`;
        const toDate = `${currentYear}-12-31`;

        // Fetch total expenses
        const expenseRes = await fetch("/api/getTransactions/specificTransactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date1: fromDate,
            date2: toDate,
            type: "expense",
          }),
        });
        const expenseData = await expenseRes.json();
        const totalExp = expenseData.data.reduce((sum: number, item: any) => sum + item.amount, 0);
        setTotalExpenses(totalExp);

        // Fetch total income
        const incomeRes = await fetch("/api/getTransactions/specificTransactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date1: fromDate,
            date2: toDate,
            type: "income",
          }),
        });
        const incomeData = await incomeRes.json();
        const totalInc = incomeData.data.reduce((sum: number, item: any) => sum + item.amount, 0);
        setTotalIncome(totalInc);

        // Prepare chart data (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29); // Last 30 days

        const startISO = thirtyDaysAgo.toISOString().split("T")[0];
        const endISO = today.toISOString().split("T")[0];
const chartData = [
    { name: "Jan", value1: 40, value2: 60 },
    { name: "Feb", value1: 55, value2: 35 },
    { name: "Mar", value1: 30, value2: 50 },
  ];
        // Fetch expenses for chart
        const expenseChartRes = await fetch("/api/getTransactions/specificTransactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date1: startISO,
            date2: endISO,
            type: "expense",
          }),
        });
        const expenseChartData = await expenseChartRes.json();

        // Fetch incomes for chart
        const incomeChartRes = await fetch("/api/getTransactions/specificTransactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date1: startISO,
            date2: endISO,
            type: "income",
          }),
        });
        const incomeChartData = await incomeChartRes.json();

        // Combine expense and income grouped by date
        const grouped: Record<
          string,
          { expense: number; income: number }
        > = {};

        for (let i = 0; i < 30; i++) {
          const date = new Date(thirtyDaysAgo);
          date.setDate(date.getDate() + i);
          const key = date.toISOString().split("T")[0];
          grouped[key] = { expense: 0, income: 0 }; // initialize all dates
        }

        // Add expenses
        expenseChartData.data.forEach((item: any) => {
          const dateKey = item.expenseAt.split("T")[0];
          if (grouped[dateKey]) {
            grouped[dateKey].expense += item.amount;
          }
        });

        // Add incomes
        incomeChartData.data.forEach((item: any) => {
          const dateKey = item.incomeAt.split("T")[0];
          if (grouped[dateKey]) {
            grouped[dateKey].income += item.amount;
          }
        });

        // Format for Recharts
        const finalChartData = Object.entries(grouped).map(([date, values]) => ({
          date,
          ...values,
        }));

        setChartData(finalChartData);
      } catch (err) {
        console.error("Error fetching totals:", err);
      }
    };

    fetchTotals();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 
          className="text-4xl font-bold mb-2"
          style={{
            background: "linear-gradient(90deg, #38bdf8, #6366f1, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shimmer 3s infinite linear"
          }}
        >
          Financial Overview
        </h1>
        <p className="text-[#94a3b8] text-lg">Your wallet's performance this year</p>
      </motion.div>

      {/* Totals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(34, 197, 94, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              boxShadow: "0 8px 32px rgba(34, 197, 94, 0.1)"
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%)",
                   filter: "blur(20px)"
                 }}
            />
            
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-[#22c55e] mb-2">Total Income (This Year)</h2>
              <p className="text-3xl font-bold text-[#22c55e]">₹{totalIncome.toLocaleString()}</p>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#22c55e] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative group"
        >
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              boxShadow: "0 8px 32px rgba(239, 68, 68, 0.1)"
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: "radial-gradient(circle at center, rgba(239, 68, 68, 0.2) 0%, transparent 70%)",
                   filter: "blur(20px)"
                 }}
            />
            
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-[#ef4444] mb-2">Total Expenses (This Year)</h2>
              <p className="text-3xl font-bold text-[#ef4444]">₹{totalExpenses.toLocaleString()}</p>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#ef4444] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative group"
        >
          <div 
            className={`p-6 rounded-2xl relative overflow-hidden ${
              savings >= 0 
                ? "border-[#3b82f6] bg-[rgba(59,130,246,0.1)]" 
                : "border-[#f59e0b] bg-[rgba(245,158,11,0.1)]"
            }`}
            style={{
              backdropFilter: "blur(20px)",
              border: `1px solid ${savings >= 0 ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'}`,
              boxShadow: `0 8px 32px ${savings >= 0 ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)'}`
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: `radial-gradient(circle at center, ${savings >= 0 ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)'} 0%, transparent 70%)`,
                   filter: "blur(20px)"
                 }}
            />
            
            <div className="relative z-10">
              <h2 className={`text-xl font-semibold mb-2 ${savings >= 0 ? 'text-[#3b82f6]' : 'text-[#f59e0b]'}`}>
                Savings (This Year)
              </h2>
              <p className={`text-3xl font-bold ${savings >= 0 ? 'text-[#3b82f6]' : 'text-[#f59e0b]'}`}>
                ₹{savings.toLocaleString()}
              </p>
            </div>
            
            {/* Animated border */}
            <div className={`absolute inset-0 rounded-2xl border opacity-30 group-hover:opacity-60 transition-opacity duration-300 ${
              savings >= 0 ? 'border-[#3b82f6]' : 'border-[#f59e0b]'
            }`} />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="space-y-8"
      >
        {/* Donut Chart */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h3 className="text-xl font-semibold text-[#e0e7ef] mb-4">Income vs Expenses Distribution</h3>
          <DonutChart
            data={[
              {
                name: "Financial Overview",
                title: "Income vs Expenses",
                total: totalIncome + totalExpenses,
                Array: [
                  { name: "Income", value: totalIncome },
                  { name: "Expense", value: totalExpenses }
                ]
              }
            ]}
            totalLabel="This Year"
          />
        </div>

        {/* Line Chart */}
        <div 
          className="p-6 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h3 className="text-xl font-semibold text-[#e0e7ef] mb-4">30-Day Trend Analysis</h3>
          <OverviewLineChart
            data={chartData}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.div>
  );
}
