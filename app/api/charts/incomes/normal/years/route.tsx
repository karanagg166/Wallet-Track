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
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (endDate) filters.expenseAt.lte = endDate;
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
      const yearKey =  `${date.getFullYear()}`; 
      if (!groupedByDate[yearKey]) groupedByDate[yearKey] = 0;
      groupedByDate[yearKey] += exp.amount;
    }

    // Convert to array format if needed for charts
    const chartData = Object.entries(groupedByDate).map(([year, total]) => ({
      year,
      total,
    }));

    return NextResponse.json({ message: "Summed by Year", data: chartData }, { status: 200 });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
