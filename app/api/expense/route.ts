import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/app/utils/cookies/cookieUtils';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, title, category, date, time, paymentmethod } = await req.json();

    // Combine date and time into a valid DateTime
    const expenseAt = new Date(`${date}T${time}`);

    const newExpense = await prisma.expense.create({
      data: {
        amount,
        title,
        category,
        paymentmethod,
        expenseAt,           // this should match your model
        userId: user.id,     // from the JWT
      },
    });

    return NextResponse.json({ message: "Expense created", data: newExpense }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
