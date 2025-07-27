'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import StackedBarChart from '@/components/charts/barcharts/stacked';

type IncomeItem = {
  name: string;
  total: number;
  [key: string]: string | number;
};

const StackedBarPage: React.FC = () => {
  const { startDate, endDate } = useDateContext();

  const [dataDate, setDataDate] = useState<IncomeItem[]>([]);
  const [dataMonth, setDataMonth] = useState<IncomeItem[]>([]);
  const [dataYear, setDataYear] = useState<IncomeItem[]>([]);

  const [loadingDate, setLoadingDate] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [loadingYear, setLoadingYear] = useState(true);

  // Daily
  useEffect(() => {
    const fetchData = async () => {
      setLoadingDate(true);
      try {
        const res = await fetch('/api/charts/incomes/incomesource/days', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1: startDate, date2: endDate }),
        });
        const json = await res.json();
       
        setDataDate(json.data || []);
      } catch (err) {
        console.error('Daily income source fetch error:', err);
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
        const res = await fetch('/api/charts/incomes/incomesource/months', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1: startDate, date2: endDate }),
        });
        const json = await res.json();
        setDataMonth(json.data || []);
      } catch (err) {
        console.error('Monthly income source fetch error:', err);
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
        const res = await fetch('/api/charts/incomes/incomesource/years', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date1: startDate, date2: endDate }),
        });
        const json = await res.json();
        setDataYear(json.data || []);
      } catch (err) {
        console.error('Yearly income source fetch error:', err);
      } finally {
        setLoadingYear(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Income Source Stacked Bar Charts</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Daily</h2>
        {loadingDate ? (
          <p className="text-gray-500">Loading daily data...</p>
        ) : (
          <StackedBarChart data={dataDate} />
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Monthly</h2>
        {loadingMonth ? (
          <p className="text-gray-500">Loading monthly data...</p>
        ) : (
          <StackedBarChart data={dataMonth} />
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Yearly</h2>
        {loadingYear ? (
          <p className="text-gray-500">Loading yearly data...</p>
        ) : (
          <StackedBarChart data={dataYear} />
        )}
      </section>
    </div>
  );
};

export default StackedBarPage;
