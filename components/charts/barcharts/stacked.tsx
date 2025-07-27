'use client';

import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

type IncomeItem = {
  name: string;
  value: number;
};

type IncomeData = {
  name: string;
  title: string;
  total: number;
  sources: IncomeItem[];
};

interface Props {
  data: IncomeData[];
}

const COLORS = [
  '#ff4d4f', '#ffc53d', '#73d13d', '#36cfc9', '#9254de',
  '#ff85c0', '#69c0ff', '#ffd666', '#ff7a45', '#bae637',
];

const StackedBarChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div>No data</div>;

  const labels = data.map((item) => item.name);

  // Collect all unique source names across all entries
  const allSources = Array.from(
    new Set(
      data.flatMap((item) => item.sources.map((src) => src.name))
    )
  );

  // Build datasets
  const datasets = allSources.map((source, idx) => ({
    label: source,
    data: data.map((item) => {
      const found = item.sources.find((i) => i.name === source);
      return found ? found.value : 0;
    }),
    backgroundColor: COLORS[idx % COLORS.length],
    stack: 'stack-0',
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Income Source Stacked Chart',
      },
      legend: {
        position: 'top' as const,
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default StackedBarChart;
