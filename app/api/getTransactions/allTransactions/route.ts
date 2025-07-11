import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
   
    const user = await getUserFromCookie();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

      console.log(user.id);
    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
      }
    });
    const totalexpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const incomes = await prisma.income.findMany({
      where: {
        userId: user.id,
      }
    });
 const totalincome = incomes.reduce((sum, income) => sum + income.amount, 0);
    // Add a `type` field to distinguish them and normalize date field
    const allTransactions = [
      ...expenses.map((e) => ({
        ...e,
        type: "expense",
        date: e.expenseAt,
      })),
      ...incomes.map((i) => ({
        ...i,
        type: "income",
        date: i.incomeAt,
      })),
    ];

    // Sort combined transactions by date DESC
    allTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
console.log(allTransactions);
  return NextResponse.json(
  {
    message: "Transactions successfully extracted",
    data: {
      transactions: allTransactions,
       totalexpense,
      totalincome
    }
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
