import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

/**
 * POST /api/transactions/filter
 * Filters transactions (expenses or incomes) based on:
 * - date & time range
 * - category or income source
 * - payment method
 * - type (expense, income, or both)
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const {
      date1,
      date2,
      time1,
      time2,
      category,
      paymentmethod,
      incomesource,
      type
    } = await req.json();

    // Construct datetime range if provided
    const fromDate = date1 && time1 ? new Date(`${date1}T${time1}`) : null;
    const toDate = date2 && time2 ? new Date(`${date2}T${time2}`) : null;

    /**
     * -------- EXPENSE FILTER --------
     */
    const expenseFilters: any = {
      userId: user.id,
      ...(category && { category }),
      ...(paymentmethod && { paymentmethod }),
    };

    if (fromDate || toDate) {
      expenseFilters.expenseAt = {};
      if (fromDate) expenseFilters.expenseAt.gte = fromDate;
      if (toDate) expenseFilters.expenseAt.lte = toDate;
    }

    const expenses = await prisma.expense.findMany({
      where: expenseFilters,
    });

    /**
     * -------- INCOME FILTER --------
     */
    const incomeFilters: any = {
      userId: user.id,
      ...(incomesource && { incomesource }),
    };

    if (fromDate || toDate) {
      incomeFilters.incomeAt = {};
      if (fromDate) incomeFilters.incomeAt.gte = fromDate;
      if (toDate) incomeFilters.incomeAt.lte = toDate;
    }

    const incomes = await prisma.income.findMany({
      where: incomeFilters,
    });

    /**
     * -------- RESPONSE BY TYPE --------
     */
    if (type === 'expense') {
      return NextResponse.json(
        { message: "Filtered expenses fetched", data: expenses },
        { status: 200 }
      );
    }

    if (type === 'income') {
      return NextResponse.json(
        { message: "Filtered incomes fetched", data: incomes },
        { status: 200 }
      );
    }

    // Return both if no type specified
    return NextResponse.json(
      {
        message: "Filtered transactions fetched",
        data: [...expenses, ...incomes],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching filtered transactions:', err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
