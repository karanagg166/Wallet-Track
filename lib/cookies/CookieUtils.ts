import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("authToken")?.value;
  return token ?? null;
}

export async function getUserFromCookie(): Promise<null | {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}> {
  const token = await getTokenFromCookie();
  if (!token || typeof token !== "string") return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const cookieStore = await cookies();
    const username = cookieStore.get("name")?.value;

    const result = {...payload, name: username};
    return result as {
      id: string;
      email: string;
      name: string;
      iat?: number;
      exp?: number;
    };
  } catch (error) {
    console.error("Invalid token in cookie:", error);
    return null;
  }
}
