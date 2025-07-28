'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import StackedBarChart from '@/components/charts/barcharts/stacked';

type EarningsSpendingData = {
  name: string;
  title: string;
  total: number;
  Array: { name: string; value: number }[];
};

const BarChartsPage = () => {
  const { startDate, endDate } = useDateContext();

  const [dataDate, setDataDate] = useState<EarningsSpendingData[]>([]);
  const [dataMonth, setDataMonth] = useState<EarningsSpendingData[]>([]);
  const [dataYear, setDataYear] = useState<EarningsSpendingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [dayRes, monthRes, yearRes] = await Promise.all([
          fetch('/api/charts/earnings-spending-stacked/days', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/earnings-spending-stacked/months', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/earnings-spending-stacked/years', {
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
        console.error('Failed to fetch earnings & spending chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [startDate, endDate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold mb-6">Earnings & Spending Charts</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Daily</h2>
        {loading ? <p>Loading...</p> : <StackedBarChart data={dataDate} />}
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Monthly</h2>
        {loading ? <p>Loading...</p> : <StackedBarChart data={dataMonth} />}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Yearly</h2>
        {loading ? <p>Loading...</p> : <StackedBarChart data={dataYear} />}
      </section>
    </div>
  );
};

export default BarChartsPage; 