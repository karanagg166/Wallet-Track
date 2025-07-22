"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle, LogIn, UserPlus, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at 20% 30%, #0f172a 60%, #1e293b 100%)' }}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between items-center px-8 py-5 relative"
        style={{
          background: "rgba(20, 28, 48, 0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "none",
          boxShadow: "0 4px 24px #0008",
          zIndex: 20,
        }}
      >
        {/* Logo + Avatar */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="text-3xl font-extrabold cursor-pointer select-none tracking-wide relative"
            style={{
              letterSpacing: 2,
              background: "linear-gradient(90deg, #38bdf8, #6366f1, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={() => router.push("/")}
          >
            WalletTrack
          </motion.div>
          <UserCircle size={38} className="text-[#38bdf8] bg-[#232b45] rounded-full p-1 shadow-inner border border-[#232b45]" />
        </div>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: "#38bdf8", color: "#fff" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/auth/login")}
            className="flex items-center gap-2 text-[#38bdf8] border border-[#38bdf8] px-5 py-2 rounded-full font-bold transition shadow backdrop-blur-lg bg-transparent hover:bg-[#38bdf8] hover:text-white"
            style={{ boxShadow: "0 2px 12px #38bdf822" }}
          >
            <LogIn size={20} /> Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: "#6366f1", color: "#fff" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/auth/signup")}
            className="flex items-center gap-2 text-[#6366f1] border border-[#6366f1] px-5 py-2 rounded-full font-bold transition shadow backdrop-blur-lg bg-transparent hover:bg-[#6366f1] hover:text-white"
            style={{ boxShadow: "0 2px 12px #6366f122" }}
          >
            <UserPlus size={20} /> Sign Up
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-6 py-12 md:px-20"
      >
        {/* Text Content */}
        <div className="flex flex-col gap-8 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl md:text-6xl font-extrabold text-[#e0e7ef] drop-shadow"
          >
            Welcome to <span className="text-[#38bdf8]">WalletTrack!</span>
          </motion.h1>
          <p className="text-gray-400 text-xl">
            Your personal finance tracker to manage income, expenses, and savings effortlessly.
          </p>
          <motion.button
            whileHover={{ scale: 1.09, boxShadow: "0 0 24px #38bdf8, 0 0 8px #fff2" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-[#38bdf8] text-white px-8 py-3 rounded-full font-bold text-lg transition shadow drop-shadow backdrop-blur-lg relative overflow-hidden"
            style={{ boxShadow: "0 2px 12px #38bdf822" }}
          >
            Get Started <ArrowRight size={22} />
          </motion.button>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-8 md:mb-0"
        >
          <img
            src="/10944902.png"
            alt="Finance Illustration"
            className="w-full max-w-md rounded-2xl shadow-xl"
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
