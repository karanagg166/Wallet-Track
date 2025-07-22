import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 🔐 Authenticate user from cookies
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // 📨 Parse optional date filters from request body
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // 📦 Set up filters (by user and optional date range)
    const filters: any = { userId: user.id };

    if (fromDate || toDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (toDate) filters.expenseAt.lte = toDate;
    }

    // 📊 Fetch expenses including payment method and date
    const expenses = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
        paymentmethod: true,
      },
    });

    // 🧮 Group by month and payment method
    const groupedByMonth: Record<string, Record<string, number>> = {};

    for (const exp of expenses) {
      const date = exp.expenseAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const method = exp.paymentmethod ?? "Unknown";
      const amt = exp.amount;

      if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = {};
      if (!groupedByMonth[monthKey][method]) groupedByMonth[monthKey][method] = 0;

      groupedByMonth[monthKey][method] += amt;
    }

    // 📈 Format data for chart consumption
    const chartData = Object.entries(groupedByMonth).map(([month, methods]) => {
      const total = Object.values(methods).reduce((sum, val) => sum + val, 0);
      return {
        name: month,         // x-axis: month
        title: "Payment Methods",
        ...methods,          // dynamic keys: Cash, Card, etc.
        total,               // optional: total expense that month
      };
    });

    // ✅ Success response
    return NextResponse.json({
      message: "Monthly chart data generated",
      data: chartData,
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
