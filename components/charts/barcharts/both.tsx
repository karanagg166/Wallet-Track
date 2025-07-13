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

export default function GroupedBarChart({ data }: Props) {
  return (
   <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={data}
    barCategoryGap="10%"
    barGap={2}
  >
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar
  dataKey="value1"
  fill="#8884d8"
  name="Category A"
  maxBarSize={30}
  activeBar={false} // disables hover bar overlay
/>
<Bar
  dataKey="value2"
  fill="#82ca9d"
  name="Category B"
  maxBarSize={30}
  activeBar={false}
/>

  </BarChart>
</ResponsiveContainer>

  );
}
