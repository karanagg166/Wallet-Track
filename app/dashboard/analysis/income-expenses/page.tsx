"use client";

import { useEffect, useState } from "react";
import GroupedBarChart from "@/components/charts/barcharts/GroupedBarChart";
import DonutChart from "@/components/charts/donutcharts/DonutChart";

type ViewMode = "income" | "expense" | "both";
type Interval = "lastMonth" | "lastYear" | "last5Years";

export default function IncomeExpensePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [interval, setInterval] = useState<Interval>("lastMonth");
  const [chartData, setChartData] = useState<
    { label: string; income: number; expense: number }[]
  >([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let apiEndpointExpense = "/api/charts/expense/normal/";
        let apiEndpointIncome = "/api/charts/incomes/normal/";

        // Determine grouping and date range
        let suffix = "months"; // default
        let startDate: string, endDate: string;

        const today = new Date();
        endDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

        if (interval === "lastMonth") {
          const lastMonth = new Date(today);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          startDate = lastMonth.toISOString().split("T")[0];
          suffix = "days"; // daily data
        } else if (interval === "lastYear") {
          const lastYear = new Date(today);
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          startDate = lastYear.toISOString().split("T")[0];
          suffix = "months"; // monthly data
        } else if (interval === "last5Years") {
          const last5Years = new Date(today);
          last5Years.setFullYear(last5Years.getFullYear() - 5);
          startDate = last5Years.toISOString().split("T")[0];
          suffix = "years"; // yearly data
        }

        // Fetch expenses & incomes
        const [expenseRes, incomeRes] = await Promise.all([
          fetch(apiEndpointExpense + suffix, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch(apiEndpointIncome + suffix, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
        ]);

        // Check if response is JSON
        if (!expenseRes.ok || !incomeRes.ok) {
          console.error("Failed API call(s)", {
            expenseStatus: expenseRes.status,
            incomeStatus: incomeRes.status,
          });
          return;
        }

        const expenseData = await expenseRes.json();
        const incomeData = await incomeRes.json();

        const expenseItems = expenseData?.data || [];
        const incomeItems = incomeData?.data || [];

        // 🔥 Merge datasets by label (day/month/year)
        const map: Record<string, { label: string; income: number; expense: number }> = {};

        expenseItems.forEach((e: any) => {
          const label = e.month || e.day || e.year || "Unknown";
          map[label] = {
            label,
            income: 0,
            expense: e.total,
          };
        });

        incomeItems.forEach((i: any) => {
          const label = i.month || i.day || i.year || "Unknown";
          if (!map[label]) {
            map[label] = {
              label,
              income: i.total,
              expense: 0,
            };
          } else {
            map[label].income = i.total;
          }
        });

        // Sort merged data
        const mergedData = Object.values(map).sort((a, b) =>
          a.label.localeCompare(b.label)
        );

        setChartData(mergedData);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setChartData([]); // fallback to empty
      }
    };

    fetchChartData();
  }, [viewMode, interval]);

  // Total income and expense for donut chart
  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Income & Expense Analysis
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          {(["income", "expense", "both"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-full text-sm ${
                viewMode === mode
                  ? `${
                      mode === "income"
                        ? "bg-green-500 text-white"
                        : mode === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                    }`
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Interval Selector */}
        <div className="flex gap-2">
          {(["lastMonth", "lastYear", "last5Years"] as Interval[]).map((intv) => (
            <button
              key={intv}
              onClick={() => setInterval(intv)}
              className={`px-3 py-1 rounded-full text-sm ${
                interval === intv
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {intv === "lastMonth"
                ? "Last Month"
                : intv === "lastYear"
                ? "Last Year"
                : "Last 5 Years"}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-2">Income & Expense</h2>
          <GroupedBarChart data={chartData} viewMode={viewMode} />
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-2">Breakdown</h2>
          <DonutChart
            data={[
              { name: "Income", value: totalIncome },
              { name: "Expense", value: totalExpense },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
