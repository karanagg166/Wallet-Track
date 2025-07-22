import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

/**
 * GET /api/category
 * Retrieves all categories for the authenticated user
 */
export async function GET(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ message: "All categories", data: categories }, { status: 200 });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/category
 * Creates a new category if it doesn't already exist for the user
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { name } = await req.json();

    // Check for duplicate category name
    const existing = await prisma.category.findFirst({
      where: {
        userId: user.id,
        name,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "This category already exists" }, { status: 409 });
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        userId: user.id,
        name,
      },
    });

    return NextResponse.json({ message: "New category added", data: category }, { status: 200 });
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/category
 * Deletes a category by ID if it belongs to the authenticated user
 */
export async function DELETE(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user?.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { categoryId } = await req.json();

    const deletion = await prisma.category.deleteMany({
      where: {
        id: categoryId,
        userId: user.id, // Ensure ownership
      },
    });

    if (deletion.count === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting category:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
