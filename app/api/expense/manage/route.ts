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
    console.log(user.id);   

    const { amount, title, category, date, time, paymentmethod } = await req.json();

    const expenseAt = new Date(`${date}T${time}`);
   
    const newExpense = await prisma.expense.create({
      data: {
        amount,
        title,
        categoryId:category,
        paymentmethod,
        expenseAt,           // this should match your model
        userId: user.id,     // from the JWT
      },
    });

    return NextResponse.json({ message: "Expense created", data: newExpense }, { status: 200 });
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
    const { expenseId } = await req.json();

   
    
    if (!expenseId) {
      return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
    }

    const exp = await prisma.expense.findUnique({ where: { id: expenseId } });

    if (!exp) {
      return NextResponse.json({ error: "Expense does not exist" }, { status: 404 });
    }

    if (exp.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You cannot delete this expense" }, { status: 403 });
    }

    const deleted = await prisma.expense.delete({ where: { id: expenseId } });  

    return NextResponse.json({ message: "Expense deleted", deleted }, { status: 200 });
  } catch (err) {
    console.error('Error deleting expense:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}