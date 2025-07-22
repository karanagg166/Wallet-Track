// app/api/login/route.ts

import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import { setUserCookies } from '@/lib/cookies/setUserCookies';
import { getTokenFromCookie } from '@/lib/cookies/CookieUtils';
import { deleteUserCookies } from '@/lib/cookies/deleteUserCookies';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * POST /api/login
 * Authenticates a user and sets a JWT in cookies
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 409 });
    }

    // Check password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    // Send response and attach cookies
    const response = NextResponse.json({ message: 'Login successful' });

    return setUserCookies(response, {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/login
 * Logs the user out by clearing cookies
 */
export async function DELETE(_req: Request) {
  try {
    const token = getTokenFromCookie();

    if (!token) {
      return NextResponse.json({ error: 'User not logged in' }, { status: 404 });
    }

    const response = NextResponse.json({ message: 'Logout successful' });
    return deleteUserCookies(response);

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
