'use client';

import React, { useState } from 'react';
import { DateContext } from '@/context/DateContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const chartOptions = [
  { name: 'Bar Charts', href: '/dashboard/analysis/income/bar-charts' },
  { name: 'Line Charts', href: '/dashboard/analysis/income/line-charts' },
  { name: 'Area Charts', href: '/dashboard/analysis/income/area-charts' },
  { name: 'Stacked Charts', href: '/dashboard/analysis/income/stacked-bar' },
  { name: 'Histogram', href: '/dashboard/analysis/income/histogram' },
];

export default function IncomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <DateContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
      <div className="min-h-screen flex flex-col">
        {/* Header with Date Inputs */}
        <div className="bg-white border-b p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Income Analysis</h1>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-3 py-2 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="bg-gray-50 border-b px-4 py-2 flex gap-3 overflow-x-auto">
          {chartOptions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                pathname === item.href
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Main Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </DateContext.Provider>
  );
}
