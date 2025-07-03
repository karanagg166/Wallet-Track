// app/private/layout.tsx
import { redirect } from 'next/navigation';
import Navbar from "@/components/Navbar"
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = true; // Replace with actual logic (cookies/token check)

  if (!isAuthenticated) {
    redirect('/public/login');
  }

  return (
    <div>
     <Navbar/>
      {children}
    </div>
  );
}
