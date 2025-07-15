"use client";

import { useEffect, useState } from "react";
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
import GroupedBarChart from '@/components/charts/barcharts/both'


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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Overview</h1>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-700">Total Income (This Year)</h2>
          <p className="text-3xl font-bold text-green-900 mt-2">₹{totalIncome}</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-red-700">Total Expenses (This Year)</h2>
          <p className="text-3xl font-bold text-red-900 mt-2">₹{totalExpenses}</p>
        </div>
        <div
          className={`p-6 rounded-xl shadow ${
            savings >= 0
              ? "bg-blue-50 border-l-4 border-blue-500"
              : "bg-yellow-50 border-l-4 border-yellow-500"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              savings >= 0 ? "text-blue-700" : "text-yellow-700"
            }`}
          >
            Savings (This Year)
          </h2>
          <p
            className={`text-3xl font-bold mt-2 ${
              savings >= 0 ? "text-blue-900" : "text-yellow-900"
            }`}
          >
            ₹{savings}
          </p>
        </div>
      </div>

      {/* Chart Section */}

       {/* Donut Chart */}
      <div className="my-8">
        <DonutChart
          data={[
            { name: "Expense", value: totalExpenses },
            { name: "Income", value: totalIncome },
          ]}
          totalLabel="This Year"
        />
      </div>



      {/* Line Chart */}
      <OverviewLineChart
        data={chartData}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />
 
    </div>
  );
}
