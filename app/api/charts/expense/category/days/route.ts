import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma client
const prisma = new PrismaClient();

// POST API: Group expenses by date and category for charting
export async function POST(req: Request) {
  try {
    // ✅ Authenticate user
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // ✅ Parse request body and extract optional date filters
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // ✅ Build filters
    const filters: any = {
      userId: user.id,
    };

    if (fromDate || toDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (toDate) filters.expenseAt.lte = toDate;
    }

    // ✅ Fetch expenses, including optional category name
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

    // ✅ Group expenses by date and category
    const groupedByDate: Record<string, Record<string, number>> = {};

    for (const expense of expenses) {
      const dateKey = expense.expenseAt.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      const categoryName = expense.category?.name ?? "Uncategorized"; // Fallback if no category
      const amount = expense.amount;

      // Initialize groupings
      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = {};
      if (!groupedByDate[dateKey][categoryName]) groupedByDate[dateKey][categoryName] = 0;

      groupedByDate[dateKey][categoryName] += amount;
    }

    // ✅ Format data for frontend chart (e.g., Recharts or ApexCharts)
   const chartData = Object.entries(groupedByDate).map(([date, categories]) => {
  const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

  const Array = Object.entries(categories).map(([categoryName, value]) => ({
    name: categoryName,
    value,
  }));

  return {
    name: date,                  // x-axis (date)
    title: "Expense Categories", // optional title
    total,                       // total per day
    Array,                       // 👈 wrapped categories
  };
});


    // ✅ Return formatted response
    return NextResponse.json(
      {
        message: "Expense chart data generated",
        data: chartData,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
