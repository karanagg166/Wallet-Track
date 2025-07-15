"use client";

import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { date: string; income: number; expense: number }[];
  viewMode: "expense" | "income" | "both";
  onChangeViewMode: (mode: "expense" | "income" | "both") => void;
};

export default function OverviewLineChart({ data, viewMode, onChangeViewMode }: Props) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Income And Expenses (Last 30 days)
        </h2>

        {/* Toggle Buttons */}
        <div className="flex gap-2">
          {["expense", "income", "both"].map((mode) => (
            <button
              key={mode}
              onClick={() => onChangeViewMode(mode as any)}
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
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const [, month, day] = date.split("-");
              return `${month}-${day}`;
            }}
          />
          <YAxis />
          <Tooltip />
          {viewMode !== "income" && (
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="Expense"
            />
          )}
          {viewMode !== "expense" && (
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Income"
            />
          )}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
