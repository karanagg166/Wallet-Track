// app/public/layout.tsx (Server Component)
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  const isLoggedIn = cookies().get('authToken'); // Replace with your cookie key

  if (isLoggedIn) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
