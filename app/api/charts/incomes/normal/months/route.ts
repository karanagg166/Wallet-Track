import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const endDate = date2 ? new Date(date2) : null;

    const filters: any = {
      userId: user.id,
    };

    if (fromDate || endDate) {
      filters.incomeAt = {};
      if (fromDate) filters.incomeAt.gte = fromDate;
      if (endDate) filters.incomeAt.lte = endDate;
    }

    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true,
        amount: true,
      },
    });

    const groupedByDate: Record<string, number> = {};

    for (const exp of incomes) {
     
     const date = exp.incomeAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groupedByDate[monthKey]) groupedByDate[monthKey] = 0;
      groupedByDate[monthKey] += exp.amount;
    }

    // Convert to array format if needed for charts
    const chartData = Object.entries(groupedByDate).map(([month, total]) => ({
      month,
      total,
    }));

    return NextResponse.json({ message: "Summed by Month", data: chartData }, { status: 200 });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
