'use client';
import React, { useEffect, useState } from 'react';
import DonutChart from '@/components/charts/donutcharts/DonutChart';

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

const ExpenseHome = () => {
  const [dataDate, setDataDate] = useState<ExpenseData[]>([]);
  const [dataMonth, setDataMonth] = useState<ExpenseData[]>([]);
  const [dataYear, setDataYear] = useState<ExpenseData[]>([]);

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

  // ✅ Reusable fetch function
  const fetchExpenseData = async (
    url: string,
    dateRange: { date1: string; date2: string },
    setData: React.Dispatch<React.SetStateAction<ExpenseData[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange),
      });
      const json = await res.json();
      console.log(json.data);
      setData(json.data || []);
    } catch (err) {
      console.error(`${url} fetch error:`, err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Single useEffect for all data fetching
  useEffect(() => {
    const fetchAll = async () => {
      const todayRange = getTodayRange();
      const monthRange = getMonthRange();
      const yearRange = getYearRange();

      await Promise.all([
        fetchExpenseData(
          '/api/charts/expense/paymentmethod/days',
          todayRange,
          setDataDate,
          setLoadingDate
        ),
        fetchExpenseData(
          '/api/charts/expense/paymentmethod/months',
          monthRange,
          setDataMonth,
          setLoadingMonth
        ),
        fetchExpenseData(
          '/api/charts/expense/paymentmethod/years',
          yearRange,
          setDataYear,
          setLoadingYear
        ),
      ]);
    };

    fetchAll();
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Expense Donut Charts</h1>

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

export default ExpenseHome;
