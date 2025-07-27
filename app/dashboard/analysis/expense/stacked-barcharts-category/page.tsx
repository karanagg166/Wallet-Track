'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import StackedBarChart from '@/components/charts/barcharts/stacked';

type ExpenseItem = {
  name: string;
  value: number;
};

type ExpenseData = {
  name: string;
  title: string;
  total: number;
  Array: ExpenseItem[];
};

const StackedBarPage: React.FC = () => {
  const { startDate, endDate } = useDateContext();

  const [dataDate, setDataDate] = useState<ExpenseData[]>([]);
  const [dataMonth, setDataMonth] = useState<ExpenseData[]>([]);
  const [dataYear, setDataYear] = useState<ExpenseData[]>([]);

  const [loadingDate, setLoadingDate] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [loadingYear, setLoadingYear] = useState(true);

  const fetchChartData = async (
    url: string,
    setter: React.Dispatch<React.SetStateAction<ExpenseData[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date1: startDate, date2: endDate }),
      });
      const json = await res.json();
      setter(json.data || []);
    } catch (err) {
      console.error(`${url} fetch error:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData('/api/charts/expense/category/days', setDataDate, setLoadingDate);
    fetchChartData('/api/charts/expense/category/months', setDataMonth, setLoadingMonth);
    fetchChartData('/api/charts/expense/category/years', setDataYear, setLoadingYear);
  }, [startDate, endDate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense Source Stacked Bar Charts</h1>

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
