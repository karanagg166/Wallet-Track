import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Get logged-in user from cookies
    const user = await getUserFromCookie();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all expenses for the user, sorted by expenseAt DESC
    const incomes = await prisma.income.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        incomeAt: "desc", // ✅ Sort by date
      },
    });

    return NextResponse.json(
      {
        message: "Transactions successfully extracted",
        data: incomes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
