// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  
  // console.log("jh");
   console.log(req);
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
 

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next(); 
  } catch {
    return NextResponse.redirect(new URL("/login", req.url)); 
  }
}

export const config = {
  matcher: [ "/dashboard"], 
};
