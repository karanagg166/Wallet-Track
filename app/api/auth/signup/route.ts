// app/api/signup/route.ts

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
import { setUserCookies } from '@/lib/cookies/setUserCookies'; 

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * POST /api/signup
 * Registers a new user, hashes password, sets cookie with JWT
 */
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 🔒 Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 🔍 Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // 🔐 Hash password before storing
    const hashedPassword = await hash(password, 10);

    // 👤 Create user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 🔑 Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    // 🍪 Set user cookies and return success response
    const response = NextResponse.json({ message: 'Signup successful' });
    return setUserCookies(response, {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token,
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
