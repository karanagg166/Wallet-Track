'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import LineChart from '@/components/charts/linecharts/route';

type ExpenseData = {
  date: string;
  total: number;
};

const LineChartsPage = () => {
  const { startDate, endDate } = useDateContext();

  const [dataDate, setDataDate] = useState<ExpenseData[]>([]);
  const [dataMonth, setDataMonth] = useState<ExpenseData[]>([]);
  const [dataYear, setDataYear] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [dayRes, monthRes, yearRes] = await Promise.all([
          fetch('/api/charts/expense/normal/days', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/expense/normal/months', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/expense/normal/years', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
        ]);

        const dayJson = await dayRes.json();
        const monthJson = await monthRes.json();
        const yearJson = await yearRes.json();

        setDataDate(dayJson.data || []);
        setDataMonth(monthJson.data || []);
        setDataYear(yearJson.data || []);
      } catch (err) {
        console.error('Failed to fetch expense data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Expense Line Charts</h1>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Daily</h2>
        {loading ? (
          <p className="text-gray-500">Loading daily chart...</p>
        ) : (
          <LineChart data={dataDate} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Monthly</h2>
        {loading ? (
          <p className="text-gray-500">Loading monthly chart...</p>
        ) : (
          <LineChart data={dataMonth} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Yearly</h2>
        {loading ? (
          <p className="text-gray-500">Loading yearly chart...</p>
        ) : (
          <LineChart data={dataYear} />
        )}
      </section>
    </div>
  );
};

export default LineChartsPage;
