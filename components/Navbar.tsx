"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/app/utils/logout";
import { Home, BarChart3, List, Info, LogOut, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import NotificationButton from "./NotificationButton";
const Navbar = () => {
  const router = useRouter();
const logout = useLogout();
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="px-8 py-4 flex justify-between items-center relative"
      style={{
        background: "rgba(20, 28, 48, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "none",
        boxShadow: "0 4px 24px #0008",
        zIndex: 20,
      }}
    >
      {/* Neon bottom border glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-0 right-0 bottom-0 h-1 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)",
          filter: "blur(8px)",
          opacity: 0.7,
        }}
      />
      {/* Logo Section with shimmer */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="text-2xl font-extrabold cursor-pointer select-none tracking-wide relative"
        style={{
          letterSpacing: 2,
          background: "linear-gradient(90deg, #38bdf8, #6366f1, #38bdf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 2.5s infinite linear",
        }}
        onClick={() => router.push("/dashboard")}
      >
        WalletTrack
        <style>{`
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .shimmer {
            background-size: 200% auto;
          }
        `}</style>
      </motion.div>

      {/* Navigation Links - pill container */}
      <div className="flex space-x-3 bg-[#232b45cc] px-4 py-2 rounded-full shadow-inner border border-[#232b45]">
        {[
          { label: "Home", icon: <Home size={18} />, path: "/dashboard" },
          { label: "Transactions", icon: <List size={18} />, path: "/dashboard/transactions" },
          { label: "Analysis", icon: <BarChart3 size={18} />, path: "/dashboard/analysis" },
          { label: "About Us", icon: <Info size={18} />, path: "/dashboard/aboutus" },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            whileHover={{
              scale: 1.13,
              color: "#38bdf8",
              boxShadow: "0 0 12px #38bdf8, 0 0 32px #6366f1",
              backgroundColor: "#1e293b",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(item.path)}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full font-semibold text-[#e0e7ef] hover:text-[#38bdf8] cursor-pointer transition select-none"
            style={{ transition: "all 0.18s" }}
          >
            {item.icon} {item.label}
          </motion.div>
        ))}
      </div>

      {/* Right Section: Notifications + Avatar + Logout */}
      <div className="flex items-center gap-3">
        <NotificationButton />
        <motion.div
          whileHover={{ scale: 1.13, boxShadow: "0 0 16px #38bdf8" }}
          className="rounded-full bg-[#232b45] p-1 shadow-inner border border-[#232b45] cursor-pointer"
          style={{ transition: "all 0.18s" }}
        >
          <UserCircle size={28} className="text-[#38bdf8]" />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.13, backgroundColor: "#ef4444", color: "#fff", boxShadow: "0 0 24px #ef4444" }}
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="flex items-center gap-2 bg-[#ef4444] text-white px-5 py-2 rounded-full font-bold cursor-pointer transition select-none shadow-lg border-none"
          style={{ background: "linear-gradient(90deg, #ef4444, #f87171)", border: "none", transition: "all 0.18s" }}
        >
          <LogOut size={20} /> Logout
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
