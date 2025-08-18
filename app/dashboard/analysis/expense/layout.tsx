'use client';

import React, { useState } from 'react';
import { DateContext } from '@/context/DateContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingDown, Calendar, Filter } from 'lucide-react';
const chartOptions = [
  { name: 'Bar Charts', href: '/dashboard/analysis/expense/bar-charts', icon: '📊' },             // Bar chart
  { name: 'Line Charts', href: '/dashboard/analysis/expense/line-charts', icon: '📈' },           // Line chart
  { name: 'Area Charts', href: '/dashboard/analysis/expense/area-charts', icon: '🌄' },           // Area chart
  { name: 'Stacked - Payment Method', href: '/dashboard/analysis/expense/stacked-bar-paymentmethods', icon: '💳' }, // Payment method
  { name: 'Stacked - Category Wise', href: '/dashboard/analysis/expense/stacked-barcharts-category', icon: '🗂️' },  // Category/grouped
];

export default function ExpenseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <DateContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
      <div className="min-h-screen flex flex-col relative overflow-hidden"
           style={{ 
             background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
             backgroundSize: "400% 400%",
             animation: "gradientShift 15s ease infinite"
           }}>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
              filter: "blur(40px)"
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-20 left-10 w-24 h-24 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
              filter: "blur(30px)"
            }}
            animate={{
              y: [0, 15, 0],
              x: [0, -8, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: "50px 50px"
               }}
          />
        </div>

        {/* Header with Date Inputs */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          style={{
            background: "rgba(20, 28, 48, 0.95)",
            backdropFilter: "blur(25px)",
            borderBottom: "1px solid rgba(239, 68, 68, 0.3)",
            boxShadow: "0 4px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(239, 68, 68, 0.1)"
          }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))",
                border: "1px solid rgba(239, 68, 68, 0.3)"
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingDown size={28} className="text-[#ef4444]" />
            </motion.div>
            
            <div>
              <h1 
                className="text-3xl font-bold mb-1"
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
              <p className="text-[#94a3b8] text-lg">Track your spending across different time periods</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 text-[#94a3b8]">
              <Filter size={20} />
              <span className="text-sm font-medium">Date Filter</span>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-[#475569] bg-[#1e293b] text-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent transition-all duration-300"
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
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-[#475569] bg-[#1e293b] text-[#e0e7ef] focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent transition-all duration-300"
                  style={{
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Options */}
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 px-6 py-4 flex gap-3 overflow-x-auto"
          style={{
            background: "rgba(20, 28, 48, 0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(239, 68, 68, 0.2)"
          }}
        >
          {chartOptions.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + (0.1 * index) }}
            >
              <Link
                href={item.href}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 text-sm font-medium px-4 py-3 flex items-center gap-2 ${
                  pathname === item.href
                    ? 'text-white bg-gradient-to-r from-[#ef4444] to-[#dc2626] shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : 'text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] hover:border hover:border-[#475569]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: "radial-gradient(circle at center, rgba(239, 68, 68, 0.15) 0%, transparent 70%)",
                       filter: "blur(20px)"
                     }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Main Page Content */}
        <main className="flex-1 p-6 relative z-10">{children}</main>

        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    </DateContext.Provider>
  );
}
