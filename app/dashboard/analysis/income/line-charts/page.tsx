'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import LineChart from '@/components/charts/linecharts/route';

type IncomeData = {
  date: string;
  total: number;
};

const LineChartsPage = () => {
  const { startDate, endDate } = useDateContext();

  const [dataDate, setDataDate] = useState<IncomeData[]>([]);
  const [dataMonth, setDataMonth] = useState<IncomeData[]>([]);
  const [dataYear, setDataYear] = useState<IncomeData[]>([]);

  const [loadingDate, setLoadingDate] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [loadingYear, setLoadingYear] = useState(true);

  // Daily
  useEffect(() => {
    const fetchData = async () => {
      setLoadingDate(true);
      try {
        const res = await fetch('/api/charts/incomes/normal/days', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1: startDate, date2: endDate }),
        });
        const json = await res.json();
        setDataDate(json.data || []);
      } catch (err) {
        console.error('Failed to fetch daily income data:', err);
      } finally {
        setLoadingDate(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  // Monthly
  useEffect(() => {
    const fetchData = async () => {
      setLoadingMonth(true);
      try {
        const res = await fetch('/api/charts/incomes/normal/months', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1: startDate, date2: endDate }),
        });
        const json = await res.json();
        setDataMonth(json.data || []);
      } catch (err) {
        console.error('Failed to fetch monthly income data:', err);
      } finally {
        setLoadingMonth(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  // Yearly
  useEffect(() => {
    const fetchData = async () => {
      setLoadingYear(true);
      try {
        const res = await fetch('/api/charts/incomes/normal/years', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1: startDate, date2: endDate }),
        });
        const json = await res.json();
        setDataYear(json.data || []);
      } catch (err) {
        console.error('Failed to fetch yearly income data:', err);
      } finally {
        setLoadingYear(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Income Line Charts</h1>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Daily</h2>
        {loadingDate ? (
          <p className="text-gray-500">Loading daily chart...</p>
        ) : (
          <LineChart data={dataDate} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Monthly</h2>
        {loadingMonth ? (
          <p className="text-gray-500">Loading monthly chart...</p>
        ) : (
          <LineChart data={dataMonth} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Yearly</h2>
        {loadingYear ? (
          <p className="text-gray-500">Loading yearly chart...</p>
        ) : (
          <LineChart data={dataYear} />
        )}
      </section>
    </div>
  );
};

export default LineChartsPage;
