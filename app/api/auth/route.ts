import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET

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
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: '3h' } // token is valid for 7 days
    );
        const res = NextResponse.json({ message: "Login successful" });
        res.cookies.set("authToken", token, {
        httpOnly: true,
       secure: true, // true for production/https
       sameSite: "lax",
       path: "/",
       maxAge: 60 * 60, // 1 hour
  });
//console.log("Cookie is being set:", res.cookies.get("authToken"));
 const user = {
  email: existingUser.email,
  name: existingUser.name,
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
      JSON.stringify({
        message: 'Login successful',
        token,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
      }),
      { status: 200 }
    );
 } 
  catch (err) {
    console.error('Login error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
