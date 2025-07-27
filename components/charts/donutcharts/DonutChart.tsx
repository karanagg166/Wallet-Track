'use client';

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a28cf7", "#ff6699"];

type DonutChartData = {
  name: string;
  title: string;
  total: number;
  Array: { name: string; value: number }[];
};

type Props = {
  data: DonutChartData[];
  totalLabel?: string;
};

export default function DonutChart({ data, totalLabel }: Props) {
  if (!data || data.length === 0 || !data[0].Array) return <p>No data</p>;

  const { Array, total } = data[0];

  const sanitizedArray = Array.map((item) => ({
    name: item.name,
    value: isNaN(item.value) ? 0 : item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={sanitizedArray}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          label
        >
          {sanitizedArray.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 16, fontWeight: 600 }}
        >
          {totalLabel ?? total.toLocaleString()}
        </text>

        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
}
