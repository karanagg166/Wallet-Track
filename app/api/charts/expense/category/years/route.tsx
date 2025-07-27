import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ✅ Authenticate user
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // ✅ Safely parse optional body
    let body = {};
    try {
      body = await req.json();
    } catch {
      // No body is fine — request all-time data
    }

    const { date1, date2 } = body as { date1?: string; date2?: string };

    // ✅ Build date range filters
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

    // ✅ Fetch expenses with category info
    const expenses = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // ✅ Group expenses by year and category
    const groupByYear: Record<string, Record<string, number>> = {};

    for (const exp of expenses) {
      const yearKey = `${exp.expenseAt.getFullYear()}`;
      const categoryName = exp.category?.name ?? "Uncategorized";
      const amt = exp.amount;

      if (!groupByYear[yearKey]) groupByYear[yearKey] = {};
      if (!groupByYear[yearKey][categoryName]) groupByYear[yearKey][categoryName] = 0;

      groupByYear[yearKey][categoryName] += amt;
    }

    // ✅ Format final chart data
   const chartData = Object.entries(groupByYear).map(([year, categories]) => {
  const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

  const Array = Object.entries(categories).map(([categoryName, value]) => ({
    name: categoryName,
    value,
  }));

  return {
    name: year,                // x-axis label
    title: "Expense Categories",
    total,                     // optional total value
    Array,                     // 👈 wrapped category values
  };
});

    return NextResponse.json(
      {
        message: "Yearly chart data generated",
        data: chartData,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
