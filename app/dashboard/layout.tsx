// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '@/components/Navbar';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Left Sidebar */}
        <Sidebar />
    //  <Navbar/>
    


      {/* Main Content Area */}
           <div className="flex flex-col flex-grow bg-white ml-56">

        <main className="flex-grow p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
