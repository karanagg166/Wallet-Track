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

export default function OverviewLineChart({
  data,
  viewMode,
  onChangeViewMode,
}: Props) {
  return (
    <div
      className="p-6 rounded-xl shadow-lg border"
      // Chart background matches page theme!
      style={{
        background: "linear-gradient(115deg, #160d35 52%, #10305f 100%)",
        color: "var(--color-card-foreground)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--color-foreground)" }}
        >
          Income & Expenses (Last 30 Days)
        </h2>

        {/* Toggle Buttons */}
        <div className="flex gap-2">
          {["expense", "income", "both"].map((mode) => {
            const isActive = viewMode === mode;
            const activeTheme =
              mode === "income"
                ? { backgroundColor: "var(--color-success)", color: "var(--color-card)" }
                : mode === "expense"
                ? { backgroundColor: "var(--color-error)", color: "var(--color-card)" }
                : { backgroundColor: "var(--color-primary)", color: "var(--color-card)" };
            return (
              <button
                key={mode}
                onClick={() => onChangeViewMode(mode as any)}
                className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                style={
                  isActive
                    ? activeTheme
                    : {
                        backgroundColor: "var(--color-muted)",
                        color: "var(--color-muted-foreground)",
                      }
                }
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <ReLineChart data={data}>
          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickFormatter={(date) => {
              const [, month, day] = date.split("-");
              return `${month}-${day}`;
            }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={{ stroke: "var(--color-border)" }}
          />
          <YAxis
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={{ stroke: "var(--color-border)" }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-foreground)",
              fontSize: "0.875rem",
            }}
          />
          {/* Expenses Line */}
          {viewMode !== "income" && (
            <Line
              type="monotone"
              dataKey="expense"
              stroke="var(--color-error)"
              strokeWidth={2}
              dot={false}
              name="Expense"
            />
          )}
          {/* Income Line */}
          {viewMode !== "expense" && (
            <Line
              type="monotone"
              dataKey="income"
              stroke="var(--color-success)"
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
