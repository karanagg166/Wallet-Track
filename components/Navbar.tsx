"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/app/utils/logout";
const Navbar = () => {
  const router = useRouter();
const logout = useLogout();
  return (
    <div className="shadow px-8 py-4 flex justify-between items-center bg-blue-200">
      {/* Logo Section */}
      <div
        onClick={() => router.push("/dashboard")}
        className="text-2xl font-bold text-gray-800 cursor-pointer"
      >
        WalletTrack
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <div
          onClick={() => router.push("/dashboard")}
          className="text-gray-700 hover:text-blue-600 font-bold cursor-pointer transition "
        >
          Home
        </div>
        <div
          onClick={() => router.push("/dashboard/transactions")}
          className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition "
        >
          Transactions
        </div>
        <div
          onClick={() => router.push("/dashboard/analysis")}
          className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition "
        >
          Analysis
        </div>
        <div
          onClick={() => router.push("/dashboard/support")}
          className="text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition "
        >
          Support
        </div>
      </div>

      {/* Right Section (Button/Profile) */}
      <div
        onClick={ logout }
        className="bg-red-300 text-black px-4 py-2 rounded hover:bg-red-500 transition cursor-pointer"
      >
        Logout
      </div>
    </div>
  );
};

export default Navbar;
