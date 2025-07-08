import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies(); // ✅ await here
  const token = cookieStore.get("authToken")?.value;
  return token ?? null;
}

export async function getUserFromCookie(): Promise<null | {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}> {
  const token = await getTokenFromCookie();
  if (!token || typeof token !== "string") return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
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
