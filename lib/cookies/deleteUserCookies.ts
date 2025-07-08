import { NextResponse } from "next/server";
import type { ResponseCookie  } from "next/dist/compiled/@edge-runtime/cookies";
export function deleteUserCookies(response: NextResponse) {
  

const options: Partial<ResponseCookie> = {
  httpOnly: true,
  path: '/',
  maxAge: 0,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

  response.cookies.set('authToken','', options);
  response.cookies.set('userId', '', options);
  response.cookies.set('email', '', options);
  response.cookies.set('name', '', options);

  return response;
}
