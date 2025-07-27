import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 🔐 Authenticate user from cookies
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // 📨 Parse request body
    let body = {};
    try {
      body = await req.json();
    } catch {
      // If body is missing or malformed, just use empty object
    }

    const { date1, date2 } = body as { date1?: string; date2?: string };
    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // 🔍 Set filters for both income and expense
    const expenseFilters: any = { userId: user.id };
    const incomeFilters: any = { userId: user.id };

    if (fromDate || toDate) {
      if (fromDate) {
        expenseFilters.expenseAt = { gte: fromDate };
        incomeFilters.incomeAt = { gte: fromDate };
      }
      if (toDate) {
        if (!expenseFilters.expenseAt) expenseFilters.expenseAt = {};
        if (!incomeFilters.incomeAt) incomeFilters.incomeAt = {};
        expenseFilters.expenseAt.lte = toDate;
        incomeFilters.incomeAt.lte = toDate;
      }
    }

    // 📦 Fetch expenses and incomes with dates
    const [expenses, incomes] = await Promise.all([
      prisma.expense.findMany({
        where: expenseFilters,
        select: { 
          amount: true,
          expenseAt: true 
        },
      }),
      prisma.income.findMany({
        where: incomeFilters,
        select: { 
          amount: true,
          incomeAt: true 
        },
      }),
    ]);

    // 📊 Group by date (daily)
    const groupedByDate: Record<string, { income: number; expense: number }> = {};

    // Process expenses
    for (const exp of expenses) {
      const dateKey = exp.expenseAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { income: 0, expense: 0 };
      }
      groupedByDate[dateKey].expense += exp.amount;
    }

    // Process incomes
    for (const inc of incomes) {
      const dateKey = inc.incomeAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { income: 0, expense: 0 };
      }
      groupedByDate[dateKey].income += inc.amount;
    }

    // 🧾 Format data for area chart - create separate datasets for income and expense
    const chartData = Object.entries(groupedByDate)
      .sort(([a], [b]) => a.localeCompare(b)) // Sort by date
      .map(([date, data]) => ({
        date: date,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense // Net amount (positive = profit, negative = loss)
      }));

    // ✅ Respond with success
    return NextResponse.json(
      {
        message: "Earnings and spending area data generated",
        data: chartData,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching earnings and spending area data:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 