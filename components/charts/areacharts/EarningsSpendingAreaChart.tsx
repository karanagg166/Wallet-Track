"use client";

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type AreaData = {
  date: string;
  income: number;
  expense: number;
  net: number;
};

type Props = {
  data: AreaData[];
};

export default function EarningsSpendingAreaChart({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ReAreaChart data={data}>
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value: number, name: string) => [
            value.toLocaleString(),
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        
        {/* Income Area */}
        <Area 
          type="monotone" 
          dataKey="income" 
          stackId="1"
          stroke="#16a34a" 
          fill="#16a34a" 
          fillOpacity={0.6}
          name="Income"
        />
        
        {/* Expense Area */}
        <Area 
          type="monotone" 
          dataKey="expense" 
          stackId="1"
          stroke="#dc2626" 
          fill="#dc2626" 
          fillOpacity={0.6}
          name="Expense"
        />
      </ReAreaChart>
    </ResponsiveContainer>
  );
} 