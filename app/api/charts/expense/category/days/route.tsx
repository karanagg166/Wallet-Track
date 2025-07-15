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

    // ✅ Filters
    const filters: any = {
      userId: user.id,
    };

    if (fromDate || toDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (toDate) filters.expenseAt.lte = toDate;
    }

    // ✅ Fetch expenses with category name (may be null)
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



    // ✅ Group by date and category name
    const groupedByDate: Record<string, Record<string, number>> = {};

    for (const exp of expenses) {
      const dateKey = exp.expenseAt.toISOString().split("T")[0];
      const categoryName = exp.category?.name ?? "Uncategorized";
      const amt = exp.amount;

      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = {};
      if (!groupedByDate[dateKey][categoryName]) groupedByDate[dateKey][categoryName] = 0;

      groupedByDate[dateKey][categoryName] += amt;
    }

    // ✅ Format final chart data
    const chartData = Object.entries(groupedByDate).map(([date, categories]) => {
      const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
      return {
        name: date,            // x-axis label
        title: "Expense Categories",
        ...categories,         // category-wise bars
        total,                 // optional: total bar height
      };
    });

    return NextResponse.json(
      {
        message: "Chart data generated",
        data: chartData,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
