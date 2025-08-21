import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 🔐 Authenticate user from cookie
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // 📥 Parse request body for optional date filters
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // 📦 Build filters
    const filters: any = { userId: user.id };
    if (fromDate || toDate) {
      filters.expenseAt = {};
      if (fromDate) filters.expenseAt.gte = fromDate;
      if (toDate) filters.expenseAt.lte = toDate;
    }

    // 📊 Fetch filtered expenses with payment method and date
    const expenses = await prisma.expense.findMany({
      where: filters,
      select: {
        expenseAt: true,
        amount: true,
        paymentmethod: true,
      },
    });

    // 🧮 Group by year and payment method
    const groupedByYear: Record<string, Record<string, number>> = {};

    for (const exp of expenses) {
      const yearKey = `${exp.expenseAt.getFullYear()}`;
      const method = exp.paymentmethod ?? "Unknown";
      const amt = exp.amount;

      if (!groupedByYear[yearKey]) groupedByYear[yearKey] = {};
      if (!groupedByYear[yearKey][method]) groupedByYear[yearKey][method] = 0;

      groupedByYear[yearKey][method] += amt;
    }

    // 📈 Format for chart consumption
   const chartData = Object.entries(groupedByYear).map(([year, methods]) => {
  const total = Object.values(methods).reduce((sum, val) => sum + val, 0);

  const Array = Object.entries(methods).map(([methodName, value]) => ({
    name: methodName,
    value,
  }));

  return {
    name: year,                // x-axis label (e.g., 2023)
    title: "Payment Methods", // for chart UI
    total,                    // total expense for the year
    Array,                    // 👈 wrap methods as an array of { name, value }
  };
});


    // ✅ Success response
    return NextResponse.json({
      message: "Yearly chart data generated",
      data: chartData,
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
