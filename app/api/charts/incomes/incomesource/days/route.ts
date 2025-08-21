import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma client
const prisma = new PrismaClient();

// POST API: Income grouped by date and income source
export async function POST(req: Request) {
  try {
    // Authenticate user via cookie
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    // Convert date strings to Date objects if provided
    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // Build query filters
    const filters: any = {
      userId: user.id,
    };

    if (fromDate || toDate) {
      filters.incomeAt = {};
      if (fromDate) filters.incomeAt.gte = fromDate;
      if (toDate) filters.incomeAt.lte = toDate;
    }

    // Fetch income records from Prisma
    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true,
        amount: true,
        incomesource: true, // e.g., "Bank", "Cash", "UPI"
      },
    });

    // Group by date (YYYY-MM-DD) and income source
    const groupedByDate: Record<string, Record<string, number>> = {};

    for (const income of incomes) {
      const dateKey = income.incomeAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const method = income.incomesource ?? "Unknown";
      const amount = income.amount;

      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = {};
      if (!groupedByDate[dateKey][method]) groupedByDate[dateKey][method] = 0;

      groupedByDate[dateKey][method] += amount;
    }

    // Format for charting libraries (e.g., Recharts)
    const chartData = Object.entries(groupedByDate).map(([date, sources]) => {
      const entries = Object.entries(sources);
      const total = entries.reduce((sum, [, val]) => sum + val, 0);
    
      return {
        name: date, // X-axis label
        title: "Income Source",
        Array: entries.map(([key, value]) => ({
          name: key,
          value: value,
        })), // ✅ renamed 'sources' to 'Array'
        total,
      };
    });
    

    // Return structured chart data
    return NextResponse.json({
      message: "Chart data generated",
      data: chartData,
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
