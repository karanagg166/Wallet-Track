'use client';
import React, { useEffect, useState } from 'react';
import DonutChart from '@/components/charts/donutcharts/DonutChart';

type EarningsSpendingData = {
  name: string;
  title: string;
  total: number;
  Array: { name: string; value: number }[];
};

const EarningsAndSpendingsPage = () => {
  const [dataDate, setDataDate] = useState<EarningsSpendingData[]>([]);
  const [dataMonth, setDataMonth] = useState<EarningsSpendingData[]>([]);
  const [dataYear, setDataYear] = useState<EarningsSpendingData[]>([]);

  const [loadingDate, setLoadingDate] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [loadingYear, setLoadingYear] = useState(true);

  const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { date1: start.toISOString(), date2: end.toISOString() };
  };

  const getMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { date1: start.toISOString(), date2: end.toISOString() };
  };

  const getYearRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return { date1: start.toISOString(), date2: end.toISOString() };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDate(true);
      const { date1, date2 } = getTodayRange();
      try {
        const res = await fetch('/api/charts/earnings-spending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1, date2 }),
        });
        const json = await res.json();
        console.log('Daily earnings & spending data:', json.data);
        setDataDate(json.data || []);
      } catch (err) {
        console.error('Error fetching daily data:', err);
      } finally {
        setLoadingDate(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMonth(true);
      const { date1, date2 } = getMonthRange();
      try {
        const res = await fetch('/api/charts/earnings-spending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1, date2 }),
        });
        const json = await res.json();
        setDataMonth(json.data || []);
      } catch (err) {
        console.error('Error fetching monthly data:', err);
      } finally {
        setLoadingMonth(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingYear(true);
      const { date1, date2 } = getYearRange();
      try {
        const res = await fetch('/api/charts/earnings-spending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1, date2 }),
        });
        const json = await res.json();
        setDataYear(json.data || []);
      } catch (err) {
        console.error('Error fetching yearly data:', err);
      } finally {
        setLoadingYear(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Earnings & Spending Donut Charts</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Daily</h2>
        {loadingDate ? <p>Loading...</p> : <DonutChart data={dataDate} totalLabel="Today" />}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Monthly</h2>
        {loadingMonth ? <p>Loading...</p> : <DonutChart data={dataMonth} totalLabel="This Month" />}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Yearly</h2>
        {loadingYear ? <p>Loading...</p> : <DonutChart data={dataYear} totalLabel="This Year" />}
      </div>
    </div>
  );
};

export default EarningsAndSpendingsPage;
