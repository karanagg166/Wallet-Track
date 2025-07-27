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

    // 📦 Fetch expenses and incomes
    const [expenses, incomes] = await Promise.all([
      prisma.expense.findMany({
        where: expenseFilters,
        select: { amount: true },
      }),
      prisma.income.findMany({
        where: incomeFilters,
        select: { amount: true },
      }),
    ]);

    // 📊 Calculate totals
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const total = totalIncome + totalExpense;

    // 🧾 Format data for donut chart
    const chartData = [{
      name: "Earnings & Spending",
      title: "Financial Overview",
      total: total,
      Array: [
        { name: "Income", value: totalIncome },
        { name: "Expense", value: totalExpense }
      ]
    }];

    // ✅ Respond with success
    return NextResponse.json(
      {
        message: "Earnings and spending data generated",
        data: chartData,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching earnings and spending data:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 