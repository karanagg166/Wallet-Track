'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import IncomeBarChart from '@/components/charts/barcharts/barchart';

type IncomeData = {
  date: string;
  total: number;
};

const BarChartsPage = () => {
  const { startDate, endDate } = useDateContext();

  const [dataDate, setDataDate] = useState<IncomeData[]>([]);
  const [dataMonth, setDataMonth] = useState<IncomeData[]>([]);
  const [dataYear, setDataYear] = useState<IncomeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [dayRes, monthRes, yearRes] = await Promise.all([
          fetch('/api/charts/incomes/normal/days', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/incomes/normal/months', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
          fetch('/api/charts/incomes/normal/years', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date1: startDate, date2: endDate }),
          }),
        ]);

        const [dayJson, monthJson, yearJson] = await Promise.all([
          dayRes.json(),
          monthRes.json(),
          yearRes.json(),
        ]);

        setDataDate(dayJson.data || []);
        setDataMonth(monthJson.data || []);
        setDataYear(yearJson.data || []);
      } catch (err) {
        console.error('Error fetching bar chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [startDate, endDate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Income Charts</h1>

      <h2>Daily</h2>
      {loading ? <p>Loading...</p> : <IncomeBarChart data={dataDate} />}

      <h2>Monthly</h2>
      {loading ? <p>Loading...</p> : <IncomeBarChart data={dataMonth} />}

      <h2>Yearly</h2>
      {loading ? <p>Loading...</p> : <IncomeBarChart data={dataYear} />}
    </div>
  );
};

export default BarChartsPage;
