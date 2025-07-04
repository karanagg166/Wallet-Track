// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full"> 
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
