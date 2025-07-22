import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

/**
 * GET /api/user
 * Retrieves the current authenticated user's basic details
 */
export async function GET(req: Request) {
  try {
    // Extract user from cookie (JWT-based authentication)
    const user = await getUserFromCookie();

    // If user not found or invalid
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Respond with user's name and email
    return NextResponse.json(
      {
        message: "User details successfully retrieved",
        userName: user.name,
        userEmail: user.email,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error retrieving user details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
