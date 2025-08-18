'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DonutChart from '@/components/charts/donutcharts/DonutChart';
import StackedBarChart from '@/components/charts/barcharts/stacked';
import EarningsSpendingAreaChart from '@/components/charts/areacharts/EarningsSpendingAreaChart';
import { TrendingUp, TrendingDown, Calendar, Filter, AlertCircle, BarChart3, PieChart, AreaChart } from 'lucide-react';

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
  const [errorDonut, setErrorDonut] = useState<string | null>(null);
  const [errorStacked, setErrorStacked] = useState<string | null>(null);
  const [errorArea, setErrorArea] = useState<string | null>(null);
  
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
    setErrorDonut(null);
    try {
      const res = await fetch('/api/charts/earnings-spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date1: startDate || undefined, 
          date2: endDate || undefined 
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      console.log('Earnings & Spending donut data:', json.data);
      setDonutData(json.data || []);
    } catch (err) {
      console.error('Error fetching earnings & spending donut data:', err);
      setErrorDonut(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoadingDonut(false);
    }
  };

  const fetchStackedData = async () => {
    setLoadingStacked(true);
    setErrorStacked(null);
    try {
      const res = await fetch('/api/charts/earnings-spending-stacked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date1: startDate || undefined, 
          date2: endDate || undefined 
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      console.log('Earnings & Spending stacked data:', json.data);
      setStackedData(json.data || []);
    } catch (err) {
      console.error('Error fetching earnings & spending stacked data:', err);
      setErrorStacked(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoadingStacked(false);
    }
  };

  const fetchAreaData = async () => {
    setLoadingArea(true);
    setErrorArea(null);
    try {
      const res = await fetch('/api/charts/earnings-spending-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date1: startDate || undefined, 
          date2: endDate || undefined 
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      console.log('Earnings & Spending area data:', json.data);
      setAreaData(json.data || []);
    } catch (err) {
      console.error('Error fetching earnings & spending area data:', err);
      setErrorArea(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoadingArea(false);
    }
  };

  useEffect(() => {
    fetchDonutData();
    fetchStackedData();
    fetchAreaData();
  }, [startDate, endDate]);

  const handleDateChange = () => {
    // Reset errors when dates change
    setErrorDonut(null);
    setErrorStacked(null);
    setErrorArea(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 
          className="text-4xl font-bold mb-2"
          style={{
            background: "linear-gradient(90deg, #38bdf8, #6366f1, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shimmer 3s infinite linear"
          }}
        >
          Earnings & Spending Analysis
        </h1>
        <p className="text-[#94a3b8] text-lg">Comprehensive financial overview and trend analysis</p>
      </motion.div>

      {/* Date Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative group"
      >
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter size={24} className="text-[#38bdf8]" />
            <h2 className="text-xl font-semibold text-[#e0e7ef]">Date Range Filter</h2>
          </div>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  handleDateChange();
                }}
                className="px-4 py-2 rounded-xl border border-[#475569] bg-[#1e293b] text-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent transition-all duration-300"
                style={{
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleDateChange();
                }}
                className="px-4 py-2 rounded-xl border border-[#475569] bg-[#1e293b] text-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent transition-all duration-300"
                style={{
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Donut Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative group"
      >
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <PieChart size={24} className="text-[#38bdf8]" />
            <h2 className="text-xl font-semibold text-[#e0e7ef]">Earnings vs Spending Overview</h2>
          </div>
          {loadingDonut ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-[#38bdf8]">
                <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          ) : errorDonut ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle size={48} className="text-[#ef4444] mx-auto mb-4" />
                <p className="text-[#ef4444] font-medium mb-2">Error loading data</p>
                <p className="text-[#94a3b8] text-sm mb-4">{errorDonut}</p>
                <button 
                  onClick={fetchDonutData}
                  className="px-4 py-2 bg-[#38bdf8] text-white rounded-xl hover:bg-[#0ea5e9] transition-colors duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <DonutChart 
              data={donutData} 
              totalLabel={donutData.length > 0 ? `Total: ₹${donutData[0]?.total?.toLocaleString() || 0}` : "No Data"} 
            />
          )}
        </div>
      </motion.div>

      {/* Stacked Bar Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative group"
      >
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={24} className="text-[#38bdf8]" />
            <h2 className="text-xl font-semibold text-[#e0e7ef]">Daily Earnings & Spending Trend</h2>
          </div>
          {loadingStacked ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-[#38bdf8]">
                <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          ) : errorStacked ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle size={48} className="text-[#ef4444] mx-auto mb-4" />
                <p className="text-[#ef4444] font-medium mb-2">Error loading data</p>
                <p className="text-[#94a3b8] text-sm mb-4">{errorStacked}</p>
                <button 
                  onClick={fetchStackedData}
                  className="px-4 py-2 bg-[#38bdf8] text-white rounded-xl hover:bg-[#0ea5e9] transition-colors duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <StackedBarChart data={stackedData} />
          )}
        </div>
      </motion.div>

      {/* Area Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative group"
      >
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AreaChart size={24} className="text-[#38bdf8]" />
            <h2 className="text-xl font-semibold text-[#e0e7ef]">Earnings & Spending Trend Analysis</h2>
          </div>
          {loadingArea ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-[#38bdf8]">
                <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          ) : errorArea ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle size={48} className="text-[#ef4444] mx-auto mb-4" />
                <p className="text-[#ef4444] font-medium mb-2">Error loading data</p>
                <p className="text-[#94a3b8] text-sm mb-4">{errorArea}</p>
                <button 
                  onClick={fetchAreaData}
                  className="px-4 py-2 bg-[#38bdf8] text-white rounded-xl hover:bg-[#0ea5e9] transition-colors duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <EarningsSpendingAreaChart data={areaData} />
          )}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default EarningsAndSpendingsPage;
