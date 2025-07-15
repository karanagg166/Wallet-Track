import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  data: { label: string; income: number; expense: number }[];
  viewMode: "income" | "expense" | "both";
};

export default function GroupedBarChart({ data, viewMode }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        {viewMode !== "expense" && (
          <Bar dataKey="income" fill="#4ade80" name="Income" />
        )}
        {viewMode !== "income" && (
          <Bar dataKey="expense" fill="#f87171" name="Expense" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
