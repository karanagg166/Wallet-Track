import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // ✅ Authenticate user from cookie
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // ✅ Parse optional request body (date1, date2)
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    // ✅ Prepare date filters
    const fromDate = date1 ? new Date(date1) : null;
    const endDate = date2 ? new Date(date2) : null;

    const filters: any = {
      userId: user.id,
    };

    if (fromDate || endDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (endDate) filters.expenseAt.lte = endDate;
    }

    // ✅ Query expenses with only amount and date
    const expenses = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
      },
    });

    // ✅ Group by day (YYYY-MM-DD)
    const groupedByDate: Record<string, number> = {};

    for (const exp of expenses) {
      const dateKey = exp.expenseAt.toISOString().split("T")[0];
      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = 0;
      groupedByDate[dateKey] += exp.amount;
    }

    // ✅ Format for charting (e.g., line/bar chart)
    const chartData = Object.entries(groupedByDate).map(([date, total]) => ({
      date,
      total,
    }));

    return NextResponse.json(
      { message: "Summed by date", data: chartData },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
