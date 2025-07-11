"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DataItem = {
  name: string;
  value1: number;
  value2: number;
};

type Props = {
  data: DataItem[];
};
const data = [
  { name: "Jan", value1: 40, value2: 60 },
  { name: "Feb", value1: 55, value2: 35 },
  { name: "Mar", value1: 30, value2: 50 },
];

export default function GroupedBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value1" fill="#8884d8" name="Category A" />
        <Bar dataKey="value2" fill="#82ca9d" name="Category B" />
      </BarChart>
    </ResponsiveContainer>
  );
}
