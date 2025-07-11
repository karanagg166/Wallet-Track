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

    // Fetch only the category names
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
      select: {
        name: true,
      },
    });

    const categoryNames = categories.map((cat) => cat.name);

    return NextResponse.json(
      {
        message: "Categories successfully extracted",
        data: categoryNames,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error getting categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
