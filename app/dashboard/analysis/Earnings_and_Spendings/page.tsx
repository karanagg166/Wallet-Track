'use client';
import React, { useEffect, useState } from 'react';
import DonutChart from '@/components/charts/donutcharts/DonutChart';
import StackedBarChart from '@/components/charts/barcharts/stacked';
import EarningsSpendingAreaChart from '@/components/charts/areacharts/EarningsSpendingAreaChart';

type EarningsSpendingData = {
  name: string;
  title: string;
  total: number;
  Array: { name: string; value: number }[];
};

type AreaData = {
  date: string;
  income: number;
  expense: number;
  net: number;
};

const EarningsAndSpendingsPage = () => {
  const [donutData, setDonutData] = useState<EarningsSpendingData[]>([]);
  const [stackedData, setStackedData] = useState<EarningsSpendingData[]>([]);
  const [areaData, setAreaData] = useState<AreaData[]>([]);
  const [loadingDonut, setLoadingDonut] = useState(true);
  const [loadingStacked, setLoadingStacked] = useState(true);
  const [loadingArea, setLoadingArea] = useState(true);
  
  // Set default start date to 4 months before today
  const getDefaultStartDate = () => {
    const today = new Date();
    const fourMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 4, today.getDate());
    return fourMonthsAgo.toISOString().split('T')[0];
  };
  
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState('');

  const fetchDonutData = async () => {
    setLoadingDonut(true);
    try {
      const res = await fetch('/api/charts/earnings-spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date1: startDate || undefined, 
          date2: endDate || undefined 
        }),
      });
      const json = await res.json();
      console.log('Earnings & Spending donut data:', json.data);
      setDonutData(json.data || []);
    } catch (err) {
      console.error('Error fetching earnings & spending donut data:', err);
    } finally {
      setLoadingDonut(false);
    }
  };

  const fetchStackedData = async () => {
    setLoadingStacked(true);
    try {
      const res = await fetch('/api/charts/earnings-spending-stacked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date1: startDate || undefined, 
          date2: endDate || undefined 
        }),
      });
      const json = await res.json();
      console.log('Earnings & Spending stacked data:', json.data);
      setStackedData(json.data || []);
    } catch (err) {
      console.error('Error fetching earnings & spending stacked data:', err);
    } finally {
      setLoadingStacked(false);
    }
  };

  const fetchAreaData = async () => {
    setLoadingArea(true);
    try {
      const res = await fetch('/api/charts/earnings-spending-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date1: startDate || undefined, 
          date2: endDate || undefined 
        }),
      });
      const json = await res.json();
      console.log('Earnings & Spending area data:', json.data);
      setAreaData(json.data || []);
    } catch (err) {
      console.error('Error fetching earnings & spending area data:', err);
    } finally {
      setLoadingArea(false);
    }
  };

  useEffect(() => {
    fetchDonutData();
    fetchStackedData();
    fetchAreaData();
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Earnings & Spending Analysis</h1>

      {/* Date Filter Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Date Range Filter</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Donut Chart Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Earnings vs Spending Overview</h2>
        {loadingDonut ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <DonutChart 
            data={donutData} 
            totalLabel={donutData.length > 0 ? `Total: ${donutData[0]?.total?.toLocaleString() || 0}` : "No Data"} 
          />
        )}
      </div>

      {/* Stacked Bar Chart Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Earnings & Spending Trend</h2>
        {loadingStacked ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <StackedBarChart data={stackedData} />
        )}
      </div>

      {/* Area Chart Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Earnings & Spending Trend Analysis</h2>
        {loadingArea ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <EarningsSpendingAreaChart data={areaData} />
        )}
      </div>
    </div>
  );
};

export default EarningsAndSpendingsPage;
