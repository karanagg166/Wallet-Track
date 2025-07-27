'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type Props = {
  data: { date: string; total: number }[];
};

export default function ExpenseBarChart({ data }: Props) {
  //console.log(data);
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No chart data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#10b981" name="Income" />
      </BarChart>
    </ResponsiveContainer>
  );
}
