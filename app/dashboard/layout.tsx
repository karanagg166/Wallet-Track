// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    
      <div className="flex flex-col h-screen w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto  bg-gray-50 text-black">
          {children}
        </main>
      </div>
  );
}
