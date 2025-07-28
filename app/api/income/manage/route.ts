import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';
import { createIncomeNotification } from '@/lib/notifications/createNotification';

const prisma = new PrismaClient();

/**
 * POST /api/income
 * Creates a new income entry for the authenticated user
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, title, date, incomesource, time } = await req.json();

    // Combine date and time into a single timestamp
    const incomeAt = new Date(`${date}T${time}`);

    const newIncome = await prisma.income.create({
      data: {
        amount,
        title,
        incomeAt,
        userId: user.id,
        incomesource,
      },
    });

    // Create notification for the new income
    try {
      await createIncomeNotification(
        user.id,
        amount,
        title,
        incomesource
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the income creation if notification fails
    }

    return NextResponse.json(
      { message: "Income created successfully", data: newIncome },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating income:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/income
 * Deletes an income entry by ID for the authenticated user
 */
export async function DELETE(req: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { incomeId } = await req.json();

    if (!incomeId) {
      return NextResponse.json({ error: "Income ID is required" }, { status: 400 });
    }

    const existingIncome = await prisma.income.findUnique({
      where: { id: incomeId },
    });

    if (!existingIncome) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    if (existingIncome.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot delete this income" },
        { status: 403 }
      );
    }

    const deletedIncome = await prisma.income.delete({
      where: { id: incomeId },
    });

    return NextResponse.json(
      { message: "Income deleted successfully", data: deletedIncome },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting income:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
