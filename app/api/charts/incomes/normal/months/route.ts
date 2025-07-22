import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma client
const prisma = new PrismaClient();

// POST handler for income grouped by month
export async function POST(req: Request) {
  try {
    // Authenticate the user from cookies
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    // Convert date strings to Date objects if provided
    const fromDate = date1 ? new Date(date1) : null;
    const endDate = date2 ? new Date(date2) : null;

    // Set up filter for Prisma query
    const filters: any = {
      userId: user.id, // Only fetch income for the current user
    };

    // Add optional date filtering on incomeAt field
    if (fromDate || endDate) {
      filters.incomeAt = {}; // Corrected field name
      if (fromDate) filters.incomeAt.gte = fromDate;
      if (endDate) filters.incomeAt.lte = endDate;
    }

    // Query incomes with applied filters
    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true, // Date the income was received
        amount: true,   // Income amount
      },
    });

    // Group income amounts by month (YYYY-MM format)
    const groupedByMonth: Record<string, number> = {};

    for (const income of incomes) {
      const date = income.incomeAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = 0;
      groupedByMonth[monthKey] += income.amount;
    }

    // Format grouped data into array format for frontend charts
    const chartData = Object.entries(groupedByMonth).map(([month, total]) => ({
      month,
      total,
    }));

    // Return the final grouped monthly income data
    return NextResponse.json({ message: "Income summed by month", data: chartData }, { status: 200 });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
