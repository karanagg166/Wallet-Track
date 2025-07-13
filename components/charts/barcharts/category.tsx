"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type DataItem = {
  name: string;
  title: string;
  [key: string]: any;
};

type Props = {
  data: DataItem[];
};

const DEFAULT_COLORS = [
  "#f87171", "#60a5fa", "#34d399", "#fbbf24",
  "#a78bfa", "#f472b6", "#818cf8", "#5eead4",
];

export default function AutoStackedBarChart({ data }: Props) {
  if (!data || data.length === 0) return <p>No data available</p>;

  // 🔍 Get keys to stack (ignore `name` and `title`)
  const keys = Array.from(
    new Set(data.flatMap((item) =>
      Object.keys(item).filter((key) => key !== "name" && key !== "title")
    ))
  );

  // 🎨 Map keys to colors
  const keyColorMap = keys.map((key, index) => ({
    key,
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  // 🏷️ Extract title from first item
  const chartTitle = data[0]?.title || "Bar Chart";

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">{chartTitle}</h2>

      {/* 🟦 Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {keyColorMap.map(({ key, color }) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-sm font-medium text-gray-700">{key}</span>
          </div>
        ))}
      </div>

      {/* 📊 Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="10%" barGap={2}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={0} />
          {keyColorMap.map(({ key, color }) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={color}
              activeBar={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
