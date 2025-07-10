import {NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromCookie } from '@/lib/cookies/CookieUtils';

const prisma = new PrismaClient();

export async function GET(req:Request) {
     try{
    const user=await getUserFromCookie();
    if(!user || !user.id){
        return NextResponse.json({error:"not authorized"} ,{status :401});
    }
   const categories = await prisma.category.findMany({
  where: { userId: user.id },
});

    return NextResponse.json({message:"all category",data:categories},{status:500});




    }
    catch (err){
         console.error('Error creating expense:', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }



}

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { name } = await req.json();

    const existingCategory = await prisma.category.findUnique({
      where: {
        userId: user.id,
        name,
      },
    });

    if (existingCategory) {
      return NextResponse.json({ message: "This category already exists" }, { status: 409 });
    }

    const newCategory = await prisma.category.create({
      data: {
        userId: user.id,
        name,
      },
    });

    return NextResponse.json({ message: "New category added", data: newCategory }, { status: 201 });
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



export async function DELETE(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { categoryId } = await req.json();

    const deleted = await prisma.category.deleteMany({
      where: {
        id: categoryId,
        userId: user.id, // ensure user is deleting their own category
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting category:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
