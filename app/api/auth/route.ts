import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
    const {  email, password } = await req.json();

    if ( !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
      });
    } 
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User does not exist ' }), {
        status: 409,
      });
    }


  const isPasswordCorrect = await compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ error: 'Wrong password' }), {
        status: 401,
      });
    }
    
    
    const response = NextResponse.json({ message: 'Login successful' });



    const token = jwt.sign(
  { id: existingUser.id, email: existingUser.email },
  JWT_SECRET,
  { expiresIn: '3h' }
);


console.log("backend token",token);





response.cookies.set('authToken', token, {
  httpOnly: true,
  path: '/',
  maxAge: 60 * 60 * 3, // 3 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});


response.cookies.set('Id', existingUser.id, {
 httpOnly: false,
  path: '/',
  maxAge: 60 * 60 * 3, // 3 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});


response.cookies.set('email', existingUser.email, {
  httpOnly: false,
  path: '/',
  maxAge: 60 * 60 * 3, // 3 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});



response.cookies.set('name', existingUser.name, {
  httpOnly: false,
  path: '/',
  maxAge: 60 * 60 * 3, // 3 hours
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});



return response;














 } 
  catch (err) {
    console.error('Login error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
