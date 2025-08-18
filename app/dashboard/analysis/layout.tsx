"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  ArrowRight,
  Activity,
} from "lucide-react";
import React from "react";

const sidebarItems = [
  {
    name: "spendings and earnings both",
    href: "/dashboard/analysis/Earnings_and_Spendings",
    icon: <PieChart />,
    description: "Complete financial overview",
    color: "from-[#38bdf8] to-[#6366f1]",
  },
  {
    name: "earnings",
    href: "/dashboard/analysis/income",
    icon: <TrendingUp />,
    description: "Income analysis & trends",
    color: "from-[#22c55e] to-[#16a34a]",
  },
  {
    name: "spendings",
    href: "/dashboard/analysis/expense",
    icon: <TrendingDown />,
    description: "Expense tracking & insights",
    color: "from-[#ef4444] to-[#dc2626]",
  },
];

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className="flex min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      {/* Background Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{ y: [0, 15, 0], x: [0, -8, 0], scale: [1, 0.9, 1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-72 relative z-10"
        style={{
          background: "rgba(20, 28, 48, 0.95)",
          backdropFilter: "blur(25px)",
          borderRight: "1px solid rgba(56, 189, 248, 0.3)",
          boxShadow: "8px 0 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(56, 189, 248, 0.1)",
        }}
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="p-8 relative"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-3 rounded-2xl relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2))",
                border: "1px solid rgba(56, 189, 248, 0.3)",
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Wallet size={28} strokeWidth={2} className="text-[#38bdf8]" />
              <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(56, 189, 248, 0.2) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
            </motion.div>

            <div>
              <h1
                className="text-2xl font-bold"
                style={{
                  background:
                    "linear-gradient(90deg, #38bdf8, #6366f1, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "200% auto",
                  animation: "shimmer 3s infinite linear",
                }}
              >
                Analyze Wallet
              </h1>
              <p className="text-[#94a3b8] text-sm">Financial Intelligence Hub</p>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-[#1e293b] to-[#334155] p-4 rounded-xl border border-[#475569]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#94a3b8] text-sm">Quick Stats</span>
              <Activity size={16} className="text-[#38bdf8]" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              <span className="text-[#e0e7ef] text-xs">Real-time data</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-3 px-6 pb-6">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 text-sm font-medium ${
                  pathname === item.href
                    ? "text-white bg-gradient-to-r from-[#1e293b] to-[#334155] border border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                    : "text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] hover:border hover:border-[#475569]"
                }`}
              >
                {/* Active Glow */}
                {pathname === item.href && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.15), transparent)`,
                      filter: "blur(2px)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                )}

                <div className="relative z-10 p-4 flex items-center gap-4">
                  {/* Improved Icon */}
                  <div
                    className={`relative p-2.5 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-10 border border-opacity-30`}
                  >
                    <div className="relative z-10 text-white">
                      {React.cloneElement(item.icon, {
                        size: 20,
                        strokeWidth: 2,
                      })}
                    </div>
                    {pathname === item.href && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background:
                            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)",
                          filter: "blur(10px)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold mb-1">{item.name}</div>
                    <div className="text-xs text-[#94a3b8] opacity-80">{item.description}</div>
                  </div>

                  <motion.div
                    className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      pathname === item.href ? "opacity-100" : ""
                    }`}
                    animate={pathname === item.href ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={16} className="text-[#38bdf8]" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-6 left-6 right-6"
        >
          <div className="bg-gradient-to-r from-[#1e293b] to-[#334155] p-4 rounded-xl border border-[#475569] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#fbbf24]" />
              <span className="text-[#fbbf24] text-sm font-medium">Pro Features</span>
            </div>
            <p className="text-[#94a3b8] text-xs">Advanced analytics & insights</p>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex-1 p-8 relative z-10"
      >
        {children}
      </motion.main>

      {/* Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
