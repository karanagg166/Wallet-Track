import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

/**
 * GET /api/transactions
 * Retrieves all expenses and incomes for the authenticated user.
 * Returns: Combined and sorted transactions list + total income and total expense.
 */
export async function GET(req: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all expenses for the user
    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
    });

    // Calculate total expense
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Fetch all incomes for the user
    const incomes = await prisma.income.findMany({
      where: { userId: user.id },
    });

    // Calculate total income
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    // Combine and normalize data into unified format
    const allTransactions = [
      ...expenses.map((expense) => ({
        ...expense,
        type: "expense",
        date: expense.expenseAt,
      })),
      ...incomes.map((income) => ({
        ...income,
        type: "income",
        date: income.incomeAt,
      })),
    ];

    // Sort all transactions in descending order by date
    allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Return final response
    return NextResponse.json(
      {
        message: "Transactions successfully retrieved",
        data: {
          transactions: allTransactions,
          totalIncome,
          totalExpense,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
