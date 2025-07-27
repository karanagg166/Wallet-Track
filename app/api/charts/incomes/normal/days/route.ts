import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma client
const prisma = new PrismaClient();

// POST handler to fetch income data grouped by date
export async function POST(req: Request) {
  try {
    // Get the authenticated user from cookies
    const user = await getUserFromCookie();
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Parse the incoming request body
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    // Convert date strings to JavaScript Date objects if provided
    const fromDate = date1 ? new Date(date1) : null;
    const endDate = date2 ? new Date(date2) : null;

    // Set up filters for the Prisma query
    const filters: any = {
      userId: user.id, // Ensure only the current user's income is fetched
    };
  
    // Add optional date range filtering on the incomeAt field
    if (fromDate || endDate) {
      filters.incomeAt = {};
      if (fromDate) filters.incomeAt.gte = fromDate; // greater than or equal to fromDate
      if (endDate) filters.incomeAt.lte = endDate;   // less than or equal to endDate
    }

    // Query the database for incomes that match the filters
    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true, // Date the income was recorded
        amount: true,   // Income amount
      },
    });

    // Group incomes by date (YYYY-MM-DD) and sum the amounts
    const groupedByDate: Record<string, number> = {};

    for (const income of incomes) {
      const dateKey = income.incomeAt.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = 0;
      groupedByDate[dateKey] += income.amount;
    }

    // Convert grouped object to array format suitable for charts or tables
    const chartData = Object.entries(groupedByDate).map(([date, total]) => ({
      date,
      total,
    }));

    // Return the response with grouped data
    return NextResponse.json({ message: "Income summed by date", data: chartData }, { status: 200 });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
