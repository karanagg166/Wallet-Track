'use client';

import React, { useEffect, useState } from 'react';
import { useDateContext } from '@/context/DateContext';
import AreaChart from '@/components/charts/areacharts/route'; // Updated import

type IncomeData = {
  date: string;
  total: number;
};

const AreaChartsPage = () => {
  const { startDate, endDate } = useDateContext();
  
  const [dataDate, setDataDate] = useState<IncomeData[]>([]);
  const [dataMonth, setDataMonth] = useState<IncomeData[]>([]);
  const [dataYear, setDataYear] = useState<IncomeData[]>([]);

  const [loadingDate, setLoadingDate] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [loadingYear, setLoadingYear] = useState(true);

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
        setDataDate(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDate(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

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
        setDataMonth(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMonth(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

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
        setDataYear(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingYear(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Income Area Charts</h1>

      <h2>Daily</h2>
      {loadingDate ? <p>Loading...</p> : <AreaChart data={dataDate} />}

      <h2>Monthly</h2>
      {loadingMonth ? <p>Loading...</p> : <AreaChart data={dataMonth} />}

      <h2>Yearly</h2>
      {loadingYear ? <p>Loading...</p> : <AreaChart data={dataYear} />}
    </div>
  );
};

export default AreaChartsPage;
