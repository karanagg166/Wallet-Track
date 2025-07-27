import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "error";
  link?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

export async function createExpenseNotification(userId: string, amount: number, title: string, category: string) {
  return createNotification({
    userId,
    title: "New Expense Added",
    message: `You added an expense of ₹${amount} for "${title}" in ${category} category.`,
    type: "info",
    link: "/dashboard/expenses",
  });
}

export async function createIncomeNotification(userId: string, amount: number, title: string, source: string) {
  return createNotification({
    userId,
    title: "New Income Added",
    message: `You added an income of ₹${amount} from "${title}" via ${source}.`,
    type: "success",
    link: "/dashboard/incomes",
  });
} 