import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ✅ Authenticate user
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // ✅ Parse body safely, in case it's empty (optional date filters)
    let body = {};
    try {
      body = await req.json();
    } catch {
      // No body is fine — treat as all-time request
    }

    const { date1, date2 } = body as { date1?: string; date2?: string };

    // ✅ Optional date filters
    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // ✅ Build dynamic Prisma filters
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

    // ✅ Group expenses by month and category
    const groupByMonth: Record<string, Record<string, number>> = {};

    for (const exp of expenses) {
      const date = exp.expenseAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const categoryName = exp.category?.name ?? "Uncategorized";
      const amount = exp.amount;

      if (!groupByMonth[monthKey]) groupByMonth[monthKey] = {};
      if (!groupByMonth[monthKey][categoryName]) groupByMonth[monthKey][categoryName] = 0;

      groupByMonth[monthKey][categoryName] += amount;
    }

    // ✅ Format final data for chart consumption
    const chartData = Object.entries(groupByMonth).map(([month, categories]) => {
      const total = Object.values(categories).reduce((sum, val) => sum + val, 0);
      return {
        name: month,                // e.g., "2025-07"
        title: "Expense Categories",// Optional label for chart groups
        ...categories,              // Category: amount
        total,                      // Total for that month
      };
    });

    // ✅ Send formatted response
    return NextResponse.json(
      {
        message: "Monthly chart data generated",
        data: chartData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
