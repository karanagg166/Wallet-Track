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

    // Grouping by date and payment method
    const groupedByDate: Record<string, Record<string, number>> = {};

    for (const exp of incomes) {
      const dateKey = exp.incomeAt.toISOString().split("T")[0];
      const method = exp.incomesource ?? "Unknown";
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
