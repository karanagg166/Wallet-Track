import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

/**
 * POST /api/charts/category-breakdown
 * Accepts startDate & endDate in request body (optional)
 * Returns category-wise expense totals for the authenticated user
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { startDate, endDate } = await req.json();

    // Build filter for expenses
    const filter: any = { userId: user.id };
    if (startDate && endDate) {
      filter.expenseAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Aggregate expenses by category
    const expenses = await prisma.expense.groupBy({
      by: ['categoryId'],
      _sum: { amount: true },
      where: filter,
    });

    // Fetch category names for these IDs
    const categoryIds = expenses.map(e => e.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    // Map totals to category names
    const response = expenses.map(expense => {
      const category = categories.find(c => c.id === expense.categoryId);
      return {
        category: category ? category.name : "Unknown",
        total: expense._sum.amount || 0,
      };
    });

    return NextResponse.json({ message: "Category-wise breakdown", data: response }, { status: 200 });

  } catch (err) {
    console.error("Error fetching category breakdown:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
