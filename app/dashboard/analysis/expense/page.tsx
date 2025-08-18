'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DonutChart from '@/components/charts/donutcharts/DonutChart';
import { TrendingDown, Calendar, DollarSign, AlertCircle } from 'lucide-react';

type ExpenseItem = {
  name: string;
  value: number;
};

type ExpenseData = {
  name: string;
  title: string;
  total: number;
  Array: ExpenseItem[];
};

const ExpenseHome = () => {
  const [dataDate, setDataDate] = useState<ExpenseData[]>([]);
  const [dataMonth, setDataMonth] = useState<ExpenseData[]>([]);
  const [dataYear, setDataYear] = useState<ExpenseData[]>([]);

  const [loadingDate, setLoadingDate] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [loadingYear, setLoadingYear] = useState(true);

  const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { date1: start.toISOString(), date2: end.toISOString() };
  };

  const getMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { date1: start.toISOString(), date2: end.toISOString() };
  };

  const getYearRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return { date1: start.toISOString(), date2: end.toISOString() };
  };

  // ✅ Reusable fetch function
  const fetchExpenseData = async (
    url: string,
    dateRange: { date1: string; date2: string },
    setData: React.Dispatch<React.SetStateAction<ExpenseData[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange),
      });
      const json = await res.json();
      console.log(json.data);
      setData(json.data || []);
    } catch (err) {
      console.error(`${url} fetch error:`, err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Single useEffect for all data fetching
  useEffect(() => {
    const fetchAll = async () => {
      const todayRange = getTodayRange();
      const monthRange = getMonthRange();
      const yearRange = getYearRange();

      await Promise.all([
        fetchExpenseData(
          '/api/charts/expense/paymentmethod/days',
          todayRange,
          setDataDate,
          setLoadingDate
        ),
        fetchExpenseData(
          '/api/charts/expense/paymentmethod/months',
          monthRange,
          setDataMonth,
          setLoadingMonth
        ),
        fetchExpenseData(
          '/api/charts/expense/paymentmethod/years',
          yearRange,
          setDataYear,
          setLoadingYear
        ),
      ]);
    };

    fetchAll();
  }, []);

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
            background: "linear-gradient(90deg, #ef4444, #dc2626, #ef4444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shimmer 3s infinite linear"
          }}
        >
          Expense Analysis
        </h1>
        <p className="text-[#94a3b8] text-lg">Track your spending patterns across different time periods</p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              boxShadow: "0 8px 32px rgba(239, 68, 68, 0.1)"
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: "radial-gradient(circle at center, rgba(239, 68, 68, 0.2) 0%, transparent 70%)",
                   filter: "blur(20px)"
                 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar size={20} className="text-[#ef4444]" />
                <h3 className="text-xl font-semibold text-[#ef4444] text-center">Today's Expenses</h3>
              </div>
              {loadingDate ? (
                <div className="flex items-center justify-center h-48">
                  <div className="flex items-center gap-2 text-[#ef4444]">
                    <div className="w-4 h-4 border-2 border-[#ef4444] border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                </div>
              ) : (
                <DonutChart 
                  data={dataDate} 
                  totalLabel={dataDate.length > 0 ? `₹${dataDate[0]?.total?.toLocaleString() || 0}` : "No Data"} 
                />
              )}
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#ef4444] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative group"
        >
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(168, 85, 247, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              boxShadow: "0 8px 32px rgba(168, 85, 247, 0.1)"
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
                   filter: "blur(20px)"
                 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingDown size={20} className="text-[#a855f7]" />
                <h3 className="text-xl font-semibold text-[#a855f7] text-center">This Month's Expenses</h3>
              </div>
              {loadingMonth ? (
                <div className="flex items-center justify-center h-48">
                  <div className="flex items-center gap-2 text-[#a855f7]">
                    <div className="w-4 h-4 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                </div>
              ) : (
                <DonutChart 
                  data={dataMonth} 
                  totalLabel={dataMonth.length > 0 ? `₹${dataMonth[0]?.total?.toLocaleString() || 0}` : "No Data"} 
                />
              )}
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#a855f7] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>

        {/* Yearly Expenses */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative group"
        >
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.1)"
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                   filter: "blur(20px)"
                 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <DollarSign size={20} className="text-[#3b82f6]" />
                <h3 className="text-xl font-semibold text-[#3b82f6] text-center">This Year's Expenses</h3>
              </div>
              {loadingYear ? (
                <div className="flex items-center justify-center h-48">
                  <div className="flex items-center gap-2 text-[#3b82f6]">
                    <div className="w-4 h-4 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                </div>
              ) : (
                <DonutChart 
                  data={dataYear} 
                  totalLabel={dataYear.length > 0 ? `₹${dataYear[0]?.total?.toLocaleString() || 0}` : "No Data"} 
                />
              )}
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#3b82f6] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12"
      >
        <div 
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={24} className="text-[#ef4444]" />
            <h3 className="text-xl font-semibold text-[#e0e7ef]">Analysis Insights</h3>
          </div>
          <p className="text-[#94a3b8] leading-relaxed">
            Track your daily, monthly, and yearly expense patterns to identify spending trends, 
            optimize your budget, and make informed financial decisions. Use the date filters above 
            to analyze specific time periods and gain deeper insights into your spending behavior.
          </p>
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

export default ExpenseHome;
