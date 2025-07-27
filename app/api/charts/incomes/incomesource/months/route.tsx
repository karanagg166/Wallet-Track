import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma client
const prisma = new PrismaClient();

// POST handler to group income by month and income source
export async function POST(req: Request) {
  try {
    // Authenticate user
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Parse request body for optional date filters
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // Build Prisma query filter
    const filters: any = {
      userId: user.id,
    };

    // Add date filters if provided
    if (fromDate || toDate) {
      filters.incomeAt = {};
      if (fromDate) filters.incomeAt.gte = fromDate;
      if (toDate) filters.incomeAt.lte = toDate;
    }

    // Query incomes from the database
    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true,
        amount: true,
        incomesource: true, // e.g., Bank, Cash, UPI
      },
    });

    // Grouping incomes by month and income source
    const groupedByMonth: Record<string, Record<string, number>> = {};

    for (const income of incomes) {
      const date = income.incomeAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g., 2025-07
      const source = income.incomesource ?? "Unknown"; // Fallback if null
      const amount = income.amount;

      // Initialize nested structure if not present
      if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = {};
      if (!groupedByMonth[monthKey][source]) groupedByMonth[monthKey][source] = 0;

      groupedByMonth[monthKey][source] += amount;
    }

    // Format data for frontend charts (e.g., stacked bar)
    const chartData = Object.entries(groupedByMonth).map(([month, sources]) => {
      const entries = Object.entries(sources);
      const total = entries.reduce((sum, [, val]) => sum + val, 0);
    
      return {
        name: month, // e.g., "2025-07"
        title: "Income Source",
        Array: entries.map(([key, value]) => ({
          name: key,
          value: value,
        })), // ✅ renamed 'sources' to 'Array'
        total,
      };
    });
    

    // Return response
    return NextResponse.json({
      message: "Monthly income chart data generated",
      data: chartData,
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
