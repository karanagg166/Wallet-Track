import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req: Request) {
   

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 409,
      });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });


 const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '3h' } // token is valid for 7 days
    );
        const res = NextResponse.json({ message: "Login successful" });
        res.cookies.set("authToken", token, {
        httpOnly: false,
       secure: true, // true for production/https
       sameSite: "lax",
       path: "/",
       maxAge: 60 * 60, // 1 hour
  });
 const user = {
  email: newUser.email,
  name: newUser.name,
};
   res.cookies.set("name",user.name, {
        httpOnly: false,
       secure: true, // true for production/https
       sameSite: "lax",
       path: "/",
       maxAge: 60 * 60, // 1 hour
  });
  res.cookies.set("email",user.email, {
        httpOnly: false,
       secure: true, // true for production/https
       sameSite: "lax",
       path: "/",
       maxAge: 60 * 60, // 1 hour
  });







    return new Response(
      JSON.stringify({ message: 'User created successfully', userId: newUser.id }),
      { status: 201 }
    );
  } catch (err) {
    console.error('Signup error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
