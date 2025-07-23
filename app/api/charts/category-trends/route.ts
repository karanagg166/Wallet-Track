import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

/**
 * POST /api/charts/category-trends
 * Body: { categoryId: string, timeline: "month" | "year" | "all" }
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { categoryId, timeline } = await req.json();
    if (!categoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    let dateFilter = {};
    const now = new Date();

    if (timeline === "month") {
      const pastMonth = new Date();
      pastMonth.setMonth(now.getMonth() - 1);
      dateFilter = { gte: pastMonth, lte: now };
    } else if (timeline === "year") {
      const pastYear = new Date();
      pastYear.setFullYear(now.getFullYear() - 1);
      dateFilter = { gte: pastYear, lte: now };
    }

    // Fetch expenses grouped by day
    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        categoryId,
        ...(timeline !== "all" && { expenseAt: dateFilter }),
      },
      orderBy: { expenseAt: 'asc' },
      select: { expenseAt: true, amount: true },
    });

    // Format data for line graph
    const data = expenses.map(e => ({
      date: e.expenseAt.toISOString().split('T')[0], // YYYY-MM-DD
      amount: e.amount,
    }));

    return NextResponse.json({ message: "Category trends fetched", data }, { status: 200 });

  } catch (err) {
    console.error("Error fetching category trends:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
