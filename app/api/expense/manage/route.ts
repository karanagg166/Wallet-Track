import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';
import { createExpenseNotification } from '@/lib/notifications/createNotification';

const prisma = new PrismaClient();

/**
 * POST /api/expense
 * Creates a new expense entry for the authenticated user.
 */
export async function POST(req: Request) {
  try {

    console.log(req);
    
    const user = await getUserFromCookie();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, title, category, date, time, paymentmethod } = await req.json();

    // Combine date and time into a single Date object
    const expenseAt = new Date(`${date}T${time}`);

    // Get category name for notification
    const categoryData = await prisma.category.findUnique({
      where: { id: category }
    });

    // Create new expense record
    const expense = await prisma.expense.create({
      data: {
        amount,
        title,
        categoryId: category,
        paymentmethod,
        expenseAt,
        userId: user.id,
      },
    });

    // Create notification for the new expense
    try {
      await createExpenseNotification(
        user.id,
        amount,
        title,
        categoryData?.name || "Unknown Category"
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the expense creation if notification fails
    }

    return NextResponse.json({ message: "Expense created", data: expense }, { status: 200 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/expense
 * Deletes an expense by ID if it belongs to the authenticated user.
 */
export async function DELETE(req: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { expenseId } = await req.json();

    if (!expenseId) {
      return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
    }

    // Find the expense to validate existence and ownership
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });

    if (!expense) {
      return NextResponse.json({ error: "Expense does not exist" }, { status: 404 });
    }

    if (expense.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: You cannot delete this expense" }, { status: 403 });
    }

    // Delete the expense
    const deletedExpense = await prisma.expense.delete({ where: { id: expenseId } });

    return NextResponse.json({ message: "Expense deleted", data: deletedExpense }, { status: 200 });
  } catch (err) {
    console.error("Error deleting expense:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
