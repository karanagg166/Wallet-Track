import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ✅ Get the current user from cookies
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // ✅ Parse request body for optional date range
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const endDate = date2 ? new Date(date2) : null;

    // ✅ Build query filters
    const filters: any = {
      userId: user.id,
    };

    if (fromDate || endDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (endDate) filters.expenseAt.lte = endDate;
    }

    // ✅ Fetch all expenses with their dates and amounts
    const expenses = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
      },
    });

    // ✅ Group amounts by month (YYYY-MM format)
    const groupedByMonth: Record<string, number> = {};

    for (const exp of expenses) {
      const date = exp.expenseAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g., "2025-07"
      
      if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = 0;
      groupedByMonth[monthKey] += exp.amount;
    }

    // ✅ Convert grouped data into array format (for charts)
    const chartData = Object.entries(groupedByMonth).map(([month, total]) => ({
      month,  // x-axis value
      total,  // y-axis value
    }));

    return NextResponse.json(
      { message: "Summed by Month", data: chartData },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
