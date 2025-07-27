'use client';

import { createContext, useContext } from 'react';

type DateContextType = {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
};

export const DateContext = createContext<DateContextType | null>(null);

export const useDateContext = () => {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error('useDateContext must be used inside DateContextProvider');
  return ctx;
};
