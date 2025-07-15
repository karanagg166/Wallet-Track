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

    let body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    const filters: any = {
      userId: user.id,
    };

    if (fromDate || toDate) {
      filters.incomeAt = {};
      if (fromDate) filters.incomeAt.gte = fromDate;
      if (toDate) filters.incomeAt.lte = toDate;
    }

    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true,
        amount: true,
        incomesource: true,
      },
    });

    // Grouping by month and payment method
    const groupedByMonth: Record<string, Record<string, number>> = {};

    for (const exp of incomes) {
      const date = exp.incomeAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const method = exp.incomesource ?? "Unknown";
      const amt = exp.amount;

      if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = {};
      if (!groupedByMonth[monthKey][method]) groupedByMonth[monthKey][method] = 0;

      groupedByMonth[monthKey][method] += amt;
    }

    // Format for chart
    const chartData = Object.entries(groupedByMonth).map(([month, methods]) => {
      const total = Object.values(methods).reduce((sum, val) => sum + val, 0);
      return {
        name: month,
        title: "Payment Methods",
        ...methods,
        total,
      };
    });

    return NextResponse.json({
      message: "Monthly chart data generated",
      data: chartData,
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
