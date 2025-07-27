'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import AreaChart from '@/components/charts/areacharts/route';

type ExpenseData = {
  date: string;
  total: number;
};

const AreaChartsPage = () => {
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
        console.error('Failed to fetch area chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [startDate, endDate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold mb-6">Expense Area Charts</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Daily</h2>
        {loading ? <p>Loading...</p> : <AreaChart data={dataDate} />}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Monthly</h2>
        {loading ? <p>Loading...</p> : <AreaChart data={dataMonth} />}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Yearly</h2>
        {loading ? <p>Loading...</p> : <AreaChart data={dataYear} />}
      </section>
    </div>
  );
};

export default AreaChartsPage;
