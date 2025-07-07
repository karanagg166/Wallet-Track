import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  return token ?? null;
}

export async function getUserFromCookie(): Promise<null | {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}> {
  const token = getTokenFromCookie(); 
  if (!token) return null;
 if (!token || typeof token !== "string") return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    return payload as {
      id: string;
      email: string;
      iat?: number;
      exp?: number;
    };
  } catch (error) {
    console.error("Invalid token in cookie:", error);
    return null;
  }
}