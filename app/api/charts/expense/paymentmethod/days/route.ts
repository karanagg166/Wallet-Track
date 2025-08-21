import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 🔐 Authenticate user from cookies
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // 📨 Parse request body (expecting optional date1 and date2)
    let body = {};
    try {
      body = await req.json();
    } catch {
      // If body is missing or malformed, just use empty object
    }

    const { date1, date2 } = body as { date1?: string; date2?: string };
    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // 🔍 Set filters (by user and optional date range)
    const filters: any = { userId: user.id };

    if (fromDate || toDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (toDate) filters.expenseAt.lte = toDate;
    }

    // 📦 Fetch relevant expenses including payment method
    const expenses = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
        paymentmethod: true,
      },
    });

    // 📊 Group data by date and payment method
    const groupedByDate: Record<string, Record<string, number>> = {};

    for (const exp of expenses) {
      const dateKey = exp.expenseAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const method = exp.paymentmethod ?? "Unknown";
      const amt = exp.amount;

      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = {};
      if (!groupedByDate[dateKey][method]) groupedByDate[dateKey][method] = 0;

      groupedByDate[dateKey][method] += amt;
    }

    // 🧾 Format final output for charting libraries
    const chartData = Object.entries(groupedByDate).map(([date, methods]) => {
  const total = Object.values(methods).reduce((sum, val) => sum + val, 0);

  // Wrap each method as { name, value } inside an array
  const Array = Object.entries(methods).map(([methodName, value]) => ({
    name: methodName,
    value,
  }));

  return {
    name: date,          // x-axis label
    title: 'Payment Methods',
    total,               // total per day
    Array,               // 👈 wrapped in `Array` as requested
  };
});

    // ✅ Respond with success
    return NextResponse.json(
      {
        message: "Chart data generated",
        data: chartData,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
