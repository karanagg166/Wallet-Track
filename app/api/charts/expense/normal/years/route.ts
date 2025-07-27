import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {

    // ✅ Authenticate user
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // ✅ Parse optional date range from body
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const endDate = date2 ? new Date(date2) : null;

    // ✅ Set up filters
    const filters: any = {
      userId: user.id,
    };

    if (fromDate || endDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (endDate) filters.expenseAt.lte = endDate;
    }

    // ✅ Fetch income records with date and amount
    const incomes = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
      },
    });

    // ✅ Group income by year (YYYY)
    const groupedByYear: Record<string, number> = {};

    for (const income of incomes) {
      const date = income.expenseAt;
      const yearKey = `${date.getFullYear()}`; // e.g., "2025"

      if (!groupedByYear[yearKey]) groupedByYear[yearKey] = 0;
      groupedByYear[yearKey] += income.amount;
    }

    // ✅ Format for chart
    const chartData = Object.entries(groupedByYear).map(([year, total]) => ({
      date:year,
      total,
    }));

    return NextResponse.json(
      { message: "Income summed by year", data: chartData },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching yearly income:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
