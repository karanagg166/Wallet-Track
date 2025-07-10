import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { date1, date2, time1, time2, category, paymentmethod, incomesource, type } = await req.json();

    const fromDate = date1 && time1 ? new Date(`${date1}T${time1}`) : null;
    const toDate = date2 && time2 ? new Date(`${date2}T${time2}`) : null;

    // Expense filters
    const filters: any = {
      userId: user.id,
      ...(category && { category }),
      ...(paymentmethod && { paymentmethod }),
    };

    if (fromDate || toDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (toDate) filters.expenseAt.lte = toDate;
    }

    const expenses = await prisma.expense.findMany({
      where: filters,
    });

    // Income filters
    const filters2: any = {
      userId: user.id,
      ...(incomesource && { incomesource }),
    };

    if (fromDate || toDate) {
      filters2.incomeAt = {};
      if (fromDate) filters2.incomeAt.gte = fromDate;
      if (toDate) filters2.incomeAt.lte = toDate;
    }

    const incomes = await prisma.income.findMany({
      where: filters2,
    });

    if (type === 'expense') {
      return NextResponse.json({ message: "Filtered expenses fetched", data: expenses }, { status: 200 });
    }

    if (type === 'income') {
      return NextResponse.json({ message: "Filtered incomes fetched", data: incomes }, { status: 200 });
    }

    return NextResponse.json({
      message: "All transactions fetched",
      data: [...expenses, ...incomes]
    }, { status: 200 });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
