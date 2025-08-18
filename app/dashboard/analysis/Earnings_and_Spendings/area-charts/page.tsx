'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import EarningsSpendingAreaChart from '@/components/charts/areacharts/EarningsSpendingAreaChart';

type AreaData = {
  date: string;
  income: number;
  expense: number;
  net: number;
};

const AreaChartsPage = () => {
  const { startDate, endDate } = useDateContext();

  const [dataDate, setDataDate] = useState<AreaData[]>([]);
  const [dataMonth, setDataMonth] = useState<AreaData[]>([]);
  const [dataYear, setDataYear] = useState<AreaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [dayRes, monthRes, yearRes] = await Promise.all([
          fetch('/api/charts/earnings-spending-area/days', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/earnings-spending-area/months', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/earnings-spending-area/years', {
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
        console.error('Failed to fetch earnings & spending area chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [startDate, endDate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold mb-6">Earnings & Spending Area Charts</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Daily</h2>
        {loading ? <p>Loading...</p> : <EarningsSpendingAreaChart data={dataDate} />}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Monthly</h2>
        {loading ? <p>Loading...</p> : <EarningsSpendingAreaChart data={dataMonth} />}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Yearly</h2>
        {loading ? <p>Loading...</p> : <EarningsSpendingAreaChart data={dataYear} />}
      </section>
    </div>
  );
};

export default AreaChartsPage; 