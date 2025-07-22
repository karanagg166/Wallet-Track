import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma client
const prisma = new PrismaClient();

// POST handler to get income grouped by year
export async function POST(req: Request) {
  try {
    // Authenticate user from cookies
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Parse the request body to get optional date filters
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    // Convert dates from string to Date objects
    const fromDate = date1 ? new Date(date1) : null;
    const endDate = date2 ? new Date(date2) : null;

    // Set up filters for the income query
    const filters: any = {
      userId: user.id, // Only fetch records belonging to this user
    };

    // Apply optional date filtering on incomeAt field
    if (fromDate || endDate) {
      filters.incomeAt = {}; // Make sure we're filtering on the correct field

      if (fromDate) filters.incomeAt.gte = fromDate; // >= fromDate
      if (endDate) filters.incomeAt.lte = endDate;   // <= endDate
    }

    // Fetch all matching income records from Prisma
    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true, // Date of income
        amount: true,   // Income amount
      },
    });

    // Group income by year and sum the amounts
    const groupedByYear: Record<string, number> = {};

    for (const income of incomes) {
      const date = income.incomeAt;
      const yearKey = `${date.getFullYear()}`; // Extract year (e.g., "2025")
      
      if (!groupedByYear[yearKey]) {
        groupedByYear[yearKey] = 0;
      }

      groupedByYear[yearKey] += income.amount;
    }

    // Convert the grouped object to an array for charts or frontend use
    const chartData = Object.entries(groupedByYear).map(([year, total]) => ({
      year,
      total,
    }));

    // Return the grouped data in the response
    return NextResponse.json(
      { message: "Income summed by year", data: chartData },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
