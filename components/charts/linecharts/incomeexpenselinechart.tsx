"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function IncomeExpenseLineChart({
  incomeData,
  expenseData,
}: {
  incomeData: { date: string; total: number }[];
  expenseData: { date: string; total: number }[];
}) {
  // 🔥 Merge income & expense series by date
  const mergedData = [...incomeData, ...expenseData].reduce((acc, curr) => {
    const found = acc.find((item) => item.date === curr.date);
    if (found) {
      if (incomeData.includes(curr)) found.income = curr.total;
      if (expenseData.includes(curr)) found.expense = curr.total;
    } else {
      acc.push({
        date: curr.date,
        income: incomeData.find((i) => i.date === curr.date)?.total || 0,
        expense: expenseData.find((e) => e.date === curr.date)?.total || 0,
      });
    }
    return acc;
  }, [] as { date: string; income: number; expense: number }[]);

  // 🔥 Sort data chronologically
  mergedData.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mergedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
      </LineChart>
    </ResponsiveContainer>
  );
}
