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

    let body = {};
    try {
      body = await req.json();
    } catch {
      // allow no body
    }

    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    const filters: any = {
      userId: user.id,
    };

    if (fromDate || toDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (toDate) filters.expenseAt.lte = toDate;
    }

    const expenses = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
        paymentmethod: true,
      },
    });

    // Grouping by date and payment method
    const groupedByDate: Record<string, Record<string, number>> = {};

    for (const exp of expenses) {
      const dateKey = exp.expenseAt.toISOString().split("T")[0];
      const method = exp.paymentmethod ?? "Unknown";
      const amt = exp.amount;

      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = {};
      if (!groupedByDate[dateKey][method]) groupedByDate[dateKey][method] = 0;

      groupedByDate[dateKey][method] += amt;
    }

    // Format for chart
    const chartData = Object.entries(groupedByDate).map(([date, methods]) => {
      const total = Object.values(methods).reduce((sum, val) => sum + val, 0);
      return {
        name: date,
        title: "Payment Methods",
        ...methods,
        total,
      };
    });

    return NextResponse.json({
      message: "Chart data generated",
      data: chartData,
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
