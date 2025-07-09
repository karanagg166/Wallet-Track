import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { setUserCookies } from '@/lib/cookies/setUserCookies'; 
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req: Request) {
   

  try {
    const { name, email, password } = await req.json();

    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 409,
      });
    }
 
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




return setUserCookies(response,{
id:newUser.id,
name:newUser.name,
email:newUser.email,
token,
});
  } catch (err) {
    console.error('Signup error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
