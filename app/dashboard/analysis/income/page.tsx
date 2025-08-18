'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DonutChart from '@/components/charts/donutcharts/DonutChart';

type IncomeItem = {
  name: string;
  value: number;
};

type IncomeData = {
  name: string;
  title: string;
  total: number;
  array: IncomeItem[];
};

const IncomeHome = () => {
  const [dataDate, setDataDate] = useState<IncomeData[]>([]);
  const [dataMonth, setDataMonth] = useState<IncomeData[]>([]);
  const [dataYear, setDataYear] = useState<IncomeData[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDate(true);
      const { date1, date2 } = getTodayRange();
      try {
        const res = await fetch('/api/charts/incomes/incomesource/days', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1, date2 }),
        });
        const json = await res.json();
        console.log(json.data);
        setDataDate(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDate(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMonth(true);
      const { date1, date2 } = getMonthRange();
      try {
        const res = await fetch('/api/charts/incomes/incomesource/months', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1, date2 }),
        });
        const json = await res.json();
        setDataMonth(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMonth(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingYear(true);
      const { date1, date2 } = getYearRange();
      try {
        const res = await fetch('/api/charts/incomes/incomesource/years', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1, date2 }),
        });
        const json = await res.json();
        setDataYear(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingYear(false);
      }
    };
    fetchData();
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
            background: "linear-gradient(90deg, #38bdf8, #6366f1, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
            animation: "shimmer 3s infinite linear"
          }}
        >
          Income Analysis
        </h1>
        <p className="text-[#94a3b8] text-lg">Track your earnings across different time periods</p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Income */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(34, 197, 94, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              boxShadow: "0 8px 32px rgba(34, 197, 94, 0.1)"
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                   background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%)",
                   filter: "blur(20px)"
                 }}
            />
            
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-[#22c55e] mb-4 text-center">Today's Income</h3>
              {loadingDate ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-[#22c55e]">Loading...</div>
                </div>
              ) : (
                <DonutChart 
                  data={dataDate} 
                  totalLabel={dataDate.length > 0 ? `₹${dataDate[0]?.total?.toLocaleString() || 0}` : "No Data"} 
                />
              )}
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#22c55e] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
              <h3 className="text-xl font-semibold text-[#3b82f6] mb-4 text-center">This Month's Income</h3>
              {loadingMonth ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-[#3b82f6]">Loading...</div>
                </div>
              ) : (
                <DonutChart 
                  data={dataMonth} 
                  totalLabel={dataMonth.length > 0 ? `₹${dataMonth[0]?.total?.toLocaleString() || 0}` : "No Data"} 
                />
              )}
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#3b82f6] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>

        {/* Yearly Income */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
              <h3 className="text-xl font-semibold text-[#a855f7] mb-4 text-center">This Year's Income</h3>
              {loadingYear ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-[#a855f7]">Loading...</div>
                </div>
              ) : (
                <DonutChart 
                  data={dataYear} 
                  totalLabel={dataYear.length > 0 ? `₹${dataYear[0]?.total?.toLocaleString() || 0}` : "No Data"} 
                />
              )}
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl border border-[#a855f7] opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default IncomeHome;
