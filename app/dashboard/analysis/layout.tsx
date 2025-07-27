"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  PieChart,
  LineChart,
  Gauge,
  TrendingUp,
  Layers,
  Bell,
} from "lucide-react";

const sidebarItems = [
 
  { name: "earnings", href: "/dashboard/analysis/income", icon: <PieChart size={18} /> },
  { name: "spendings", href: "/dashboard/analysis/expense", icon: <PieChart size={18} /> },
];

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 text-2xl font-bold text-indigo-600">
          Analyze Wallet
        </div>

        <nav className="flex flex-col gap-1 mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 text-sm
                ${
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
