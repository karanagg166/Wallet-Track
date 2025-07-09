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

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 409 });
    }

    const isPasswordCorrect = await compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    // ✅ Create response first
    const response = NextResponse.json({ message: 'Login successful' });

    // ✅ Set cookies into that response
    return setUserCookies(response, {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function DELETE(req:Request){

try {
const token=getTokenFromCookie();
if(!token){
    return NextResponse.json({ error: 'User not logged in' }, { status: 404 });
}
const response = NextResponse.json({ message: 'Logout Sucessfully' });
return deleteUserCookies(response);


}
catch(err){
 console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

}

}
