// app/dashboard/layout.tsx (or wherever it's located)
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
   
      <Navbar />

      <main className="flex-grow p-4 pt-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
