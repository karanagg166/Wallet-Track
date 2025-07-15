"use client";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

type Props = {
  data: { name: string; value: number }[];
  totalLabel?: string; // Optional label in the center
};

export default function DonutChart({ data, totalLabel }: Props) {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60} // 👈 Creates donut hole
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        {/* Center Text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xl font-semibold"
        >
          {totalLabel ?? total}
        </text>

        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
}
