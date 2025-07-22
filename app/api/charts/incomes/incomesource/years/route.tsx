import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { getUserFromCookie } from "@/lib/cookies/CookieUtils";

// Initialize Prisma client
const prisma = new PrismaClient();

// POST handler to group income by year and income source (e.g., method)
export async function POST(req: Request) {
  try {
    // Authenticate the user from cookie
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Parse the request body and extract optional date filters
    const body = await req.json();
    const { date1, date2 } = body as { date1?: string; date2?: string };

    // Convert provided date strings to Date objects
    const fromDate = date1 ? new Date(date1) : null;
    const toDate = date2 ? new Date(date2) : null;

    // Build Prisma filter query
    const filters: any = {
      userId: user.id, // Filter by current user
    };

    // Add date range filtering if provided
    if (fromDate || toDate) {
      filters.incomeAt = {};
      if (fromDate) filters.incomeAt.gte = fromDate;
      if (toDate) filters.incomeAt.lte = toDate;
    }

    // Query the income records with filtering
    const incomes = await prisma.income.findMany({
      where: filters,
      select: {
        incomeAt: true,
        amount: true,
        incomesource: true, // Income source like Bank, Cash, etc.
      },
    });

    // Group income by year and source
    const groupedByYear: Record<string, Record<string, number>> = {};

    for (const income of incomes) {
      const date = income.incomeAt;
      const yearKey = `${date.getFullYear()}`; // Group by year
      const source = income.incomesource ?? "Unknown"; // Fallback for null
      const amount = income.amount;

      // Initialize year bucket
      if (!groupedByYear[yearKey]) groupedByYear[yearKey] = {};
      // Initialize income source bucket
      if (!groupedByYear[yearKey][source]) groupedByYear[yearKey][source] = 0;

      groupedByYear[yearKey][source] += amount;
    }

    // Format data for chart (array of objects per year with sources)
    const chartData = Object.entries(groupedByYear).map(([year, sources]) => {
      const total = Object.values(sources).reduce((sum, val) => sum + val, 0);
      return {
        name: year,             // X-axis label
        title: "Income Source", // For labeling/grouping in UI
        ...sources,             // Spread all income sources
        total,                  // Total income for the year
      };
    });

    // Return final grouped data
    return NextResponse.json({
      message: "Yearly income grouped by source",
      data: chartData,
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching chart data:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
