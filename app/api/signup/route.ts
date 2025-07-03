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
       
      

 const response = NextResponse.json({ message: 'Login successful' });




response.cookies.set('authToken', token, {
  httpOnly: true,
  path: '/',
  maxAge: 60 * 60 * 3, // 3 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});

return response;
  } catch (err) {
    console.error('Signup error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
