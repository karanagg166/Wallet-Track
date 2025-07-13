import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const user = await getUserFromCookie();

        if(!user || !user.id){
            return NextResponse.json({ error: "Unautharized"}, {status: 401});
        }

        return NextResponse.json(
        {
            message: "User Details successfully extracted",
            userName: user.name,
            userEmail: user.email
        },
        { status: 200 });

    } catch (error) {
        console.error("Error getting User Details:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}