// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col h-full ml-0 sm:ml-64">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
