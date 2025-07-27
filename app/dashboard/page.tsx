"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

type SummaryData = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
};

function useCardTilt() {
  const ref = useRef(null);
  function handleMouseMove(e) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  }
  function handleMouseLeave() {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  }
  return { ref, handleMouseMove, handleMouseLeave };
}

export default function Home() {
  const router = useRouter();
  
  const [userName, setUserName] = useState("User");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Card tilt refs
  const incomeRef = useRef(null);
  const expenseRef = useRef(null);
  const balanceRef = useRef(null);

  function handleCardMouseMove(ref, e) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  }
  function handleCardMouseLeave(ref) {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  }

  // Fetch summary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getTransactions/allTransactions", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const result = await res.json();
      //  console.log(result);
        const { totalIncome, totalExpense } = result.data;
        const netBalance = totalIncome - totalExpense;

    

        setSummary({
          totalIncome: totalIncome,
          totalExpense: totalExpense,
          netBalance,
        });

        const res2 = await fetch("/api/getUser", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const {userName: name} = await res2.json();
        //console.log(name)
        setUserName(name);

      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/charts/incomes/normal/days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({}),
        });
         const data = await res.json();
      console.log("tested data",data); 

      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardConfigs = [
    {
      key: 'income',
      icon: ArrowUpCircle,
      iconClass: 'text-green-400 drop-shadow-lg',
      iconStyle: { filter: 'drop-shadow(0 0 8px #22c55e)' },
      label: 'Total Income',
      value: summary?.totalIncome,
      valueClass: 'text-green-400',
      valueStyle: { textShadow: '0 0 8px #22c55e' },
      boxShadow: '0 4px 32px #22c55e33, 0 2px 24px #000a',
      border: '1.5px solid #22c55e33',
      hoverBoxShadow: '0 0 0 2px #22c55e, 0 2px 24px #000a',
      ref: incomeRef,
    },
    {
      key: 'expense',
      icon: ArrowDownCircle,
      iconClass: 'text-red-400 drop-shadow-lg',
      iconStyle: { filter: 'drop-shadow(0 0 8px #ef4444)' },
      label: 'Total Expenses',
      value: summary?.totalExpense,
      valueClass: 'text-red-400',
      valueStyle: { textShadow: '0 0 8px #ef4444' },
      boxShadow: '0 4px 32px #ef444433, 0 2px 24px #000a',
      border: '1.5px solid #ef444433',
      hoverBoxShadow: '0 0 0 2px #ef4444, 0 2px 24px #000a',
      ref: expenseRef,
    },
    {
      key: 'balance',
      icon: TrendingUp,
      iconClass: summary?.netBalance >= 0 ? 'text-blue-400 drop-shadow-lg' : 'text-yellow-400 drop-shadow-lg',
      iconStyle: { filter: summary?.netBalance >= 0 ? 'drop-shadow(0 0 8px #38bdf8)' : 'drop-shadow(0 0 8px #fde047)' },
      label: 'Net Balance',
      value: summary?.netBalance?.toFixed(2),
      valueClass: summary?.netBalance >= 0 ? 'text-blue-400' : 'text-yellow-400',
      valueStyle: { textShadow: summary?.netBalance >= 0 ? '0 0 8px #38bdf8' : '0 0 8px #fde047' },
      boxShadow: summary?.netBalance >= 0 ? '0 4px 32px #38bdf833, 0 2px 24px #000a' : '0 4px 32px #fde04733, 0 2px 24px #000a',
      border: summary?.netBalance >= 0 ? '1.5px solid #38bdf833' : '1.5px solid #fde04733',
      hoverBoxShadow: summary?.netBalance >= 0 ? '0 0 0 2px #38bdf8, 0 2px 24px #000a' : '0 0 0 2px #fde047, 0 2px 24px #000a',
      ref: balanceRef,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at 20% 30%, #0f172a 60%, #1e293b 100%)', position: 'relative' }}>
      {/* Summary Section */}
      <section className="px-6 py-6 md:px-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl font-bold text-[#e0e7ef] mb-4 text-center drop-shadow"
        >
          This Month&apos;s Summary
        </motion.h2>

        {loading ? (
          <p className="text-gray-400 text-center">Loading summary...</p>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.18 } },
                hidden: {},
              }}
            >
              {cardConfigs.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.key}
                    ref={card.ref}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      boxShadow: card.hoverBoxShadow,
                    }}
                    onMouseMove={e => handleCardMouseMove(card.ref, e)}
                    onMouseLeave={() => handleCardMouseLeave(card.ref)}
                    className="rounded-3xl p-8 text-center shadow-xl backdrop-blur-xl bg-white/10 relative overflow-hidden transition-all duration-200"
                    style={{ boxShadow: card.boxShadow, border: card.border }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.13 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex justify-center mb-3"
                    >
                      <Icon size={44} className={card.iconClass} style={card.iconStyle} />
                    </motion.div>
                    <p className="text-gray-300 text-lg">{card.label}</p>
                    <p className={`text-4xl font-extrabold mt-1 tracking-wide ${card.valueClass}`} style={card.valueStyle}>
                      ₹{card.value}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-6 py-3 md:px-20"
      >
        {/* Text Content */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0e7ef] drop-shadow">
            Welcome back, <span className="text-[#38bdf8]">{userName}!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Let’s keep track of your finances and stay on top of your goals.
          </p>

          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.09, boxShadow: "0 0 24px #38bdf8, 0 0 8px #fff2" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard/transactions")}
              className="bg-[#101c2fbb] border border-[#38bdf8] text-[#38bdf8] px-6 py-2.5 rounded-full font-bold transition shadow drop-shadow backdrop-blur-lg relative overflow-hidden"
              style={{ boxShadow: "0 2px 12px #38bdf822" }}
            >
              <span className="relative z-10">View Transactions</span>
              {/* Button shimmer */}
              <motion.div
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.18 }}
                style={{
                  background: "linear-gradient(120deg, transparent 60%, #38bdf844 100%)",
                  filter: "blur(8px)",
                }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.09, boxShadow: "0 0 24px #ef4444, 0 0 8px #fff2" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard/expenses")}
              className="bg-[#2a1616bb] border border-[#ef4444] text-[#ef4444] px-6 py-2.5 rounded-full font-bold transition shadow drop-shadow backdrop-blur-lg relative overflow-hidden"
              style={{ boxShadow: "0 2px 12px #ef444422" }}
            >
              <span className="relative z-10">Add Expense</span>
              <motion.div
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.18 }}
                style={{
                  background: "linear-gradient(120deg, transparent 60%, #ef444444 100%)",
                  filter: "blur(8px)",
                }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.09, boxShadow: "0 0 24px #22c55e, 0 0 8px #fff2" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard/incomes")}
              className="bg-[#162a16bb] border border-[#22c55e] text-[#22c55e] px-6 py-2.5 rounded-full font-bold transition shadow drop-shadow backdrop-blur-lg relative overflow-hidden"
              style={{ boxShadow: "0 2px 12px #22c55e22" }}
            >
              <span className="relative z-10">Add Income</span>
              <motion.div
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.18 }}
                style={{
                  background: "linear-gradient(120deg, transparent 60%, #22c55e44 100%)",
                  filter: "blur(8px)",
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-8 md:mb-0"
        >
          <img
            src="/ftmoney.svg"
            alt="Finance Illustration"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="flex justify-center items-center py-4 bg-transparent border-t border-[#222c37] mt-8">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} WalletTrack. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
