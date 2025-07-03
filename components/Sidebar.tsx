"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Insights as InsightsIcon,
  ShowChart as ShowChartIcon,
  SmartToy as SmartToyIcon,
  NotificationsActive as NotificationsActiveIcon,
  MenuBook as MenuBookIcon,
  Article as ArticleIcon,
  EmojiEvents as EmojiEventsIcon,
  AccountCircle as AccountCircleIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NavItems: NavItem[] = [
  {
    id: "Portfolio",
    label: "Portfolio",
    href: "/Portfolio",
    icon: <InsightsIcon sx={{ color: "#bbf7d0" }} />, // light green
  },
  {
    id: "Live Prices",
    label: "Live Prices",
    href: "/Live Prices",
    icon: <ShowChartIcon sx={{ color: "#bfdbfe" }} />, // light blue
  },
  {
    id: "AI Advisor",
    label: "AI Advisor",
    href: "/AI Advisor",
    icon: <SmartToyIcon sx={{ color: "#fbcfe8" }} />, // light pink
  },
  {
    id: "Alerts",
    label: "Alerts",
    href: "/Alerts",
    icon: <NotificationsActiveIcon sx={{ color: "#fde68a" }} />, // light yellow
  },
  {
    id: "Journal",
    label: "Journal",
    href: "/Journal",
    icon: <MenuBookIcon sx={{ color: "#ddd6fe" }} />, // light violet
  },
  {
    id: "News",
    label: "News",
    href: "/News",
    icon: <ArticleIcon sx={{ color: "#fecdd3" }} />, // light rose
  },
  {
    id: "Leaderboard",
    label: "Leaderboard",
    href: "/Leaderboard",
    icon: <EmojiEventsIcon sx={{ color: "#fed7aa" }} />, // light orange
  },
  {
    id: "Profile",
    label: "Profile",
    href: "/Profile",
    icon: <AccountCircleIcon sx={{ color: "#bae6fd" }} />, // light sky
  },
  {
    id: "Billing",
    label: "Billing",
    href: "/Billing",
    icon: <CreditCardIcon sx={{ color: "#f9a8d4" }} />, // light pink
  },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
return (
  <motion.aside
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="w-64 h-screen fixed top-0 left-0 z-50 flex-col p-4 sm:p-5
               bg-gradient-to-b from-white-500 via-indigo-500 to-blue-900 
               text-white shadow-lg
               hidden sm:flex" // hidden on xs, visible on sm+
  >
    {/* Logo/Header */}
    <motion.h1
      className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      StockSense 🚀
    </motion.h1>

    {/* Nav Items */}
    <ul className="space-y-2">
      {NavItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <motion.li
            key={item.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(item.href)}
            className={`flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-2 rounded-xl cursor-pointer transition-all
              ${
                isActive
                  ? "bg-white/20 backdrop-blur text-white font-semibold"
                  : "hover:bg-white/10 hover:backdrop-blur-sm text-white"
              }`}
          >
            <span className="text-lg sm:text-xl">{item.icon}</span>
            <span className="text-base sm:text-xl md:text-2xl font-medium">
              {item.label}
            </span>
          </motion.li>
        );
      })}
    </ul>
  </motion.aside>
);

};

export default Sidebar;
