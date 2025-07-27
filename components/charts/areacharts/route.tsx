"use client";

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { date: string; total: number }[];
};

export default function AreaChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReAreaChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
