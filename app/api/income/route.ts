import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();

    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, title, date,incomesource } = await req.json();

    const incomeAt = new Date(date);
    console.log(incomeAt);
    const newIncome = await prisma.income.create({
      data: {
        amount,
        title,
        incomeAt,  
        userId: user.id, 
        incomesource,
      },
    });

    return NextResponse.json({ message: "Expense created", data: newIncome }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const user = await getUserFromCookie();
     if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { incomeId } = await req.json();
    
    if (!incomeId) {
      return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
    }

    const exp = await prisma.income.findUnique({ where: { id: incomeId } });
console.log("hi",exp);
    if (!exp) {
      return NextResponse.json({ error: "Expense does not exist" }, { status: 404 });
    }

    if (exp.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You cannot delete this expense" }, { status: 403 });
    }

    const deleted = await prisma.income.delete({ where: { id: incomeId } });  

    return NextResponse.json({ message: "Expense deleted", deleted }, { status: 200 });
  } catch (err) {
    console.error('Error deleting expense:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

