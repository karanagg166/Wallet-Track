// lib/cookies/setUserCookies.ts
import { NextResponse } from 'next/server'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
export function setUserCookies(
  response: NextResponse,
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
  }
) {
  

const options: Partial<ResponseCookie> = {
  httpOnly: true,
  path: '/',
  maxAge: 60 * 60 * 30,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

  response.cookies.set('authToken', user.token, options);
  response.cookies.set('userId', user.id, options);
  response.cookies.set('email', user.email, options);
  response.cookies.set('name', user.name, options);

  return response;
}
