// app/private/layout.tsx
import { redirect } from 'next/navigation';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = true; // Replace with actual logic (cookies/token check)

  if (!isAuthenticated) {
    redirect('/public/login');
  }

  return (
    <div>
      {/* Optional: Private sidebar/navbar */}
      {children}
    </div>
  );
}
