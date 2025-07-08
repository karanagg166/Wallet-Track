"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Example user name (you can fetch this from an API or context later)
  const userName = "Harsh";

  return (
    <main className="min-h-screen flex flex-col">
    
      {/* Welcome Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-6 py-12 md:px-20 bg-gradient-to-r from-blue-50 to-blue-100">
        {/* Text Content */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Welcome back, <span className="text-blue-600">{userName}!</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Let's keep track of your finances and stay on top of your goals.
          </p>
          <div className="flex gap-4">
            <div
              onClick={() => router.push("/dashboard/transactions")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition"
            >
              View Transactions
            </div>
            <div
              onClick={() => router.push("/dashboard/expenses")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 cursor-pointer transition"
            >
              Add Expense
            </div>
  <div
              onClick={() => router.push("/dashboard/incomes")}
              className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 cursor-pointer transition"
            >
              Add Income
            </div>


          </div>
        </div>

        {/* Illustration */}
        <div className="mb-8 md:mb-0">
          <img
            src="/ftmoney.svg"
            alt="Finance Illustration"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-center items-center py-4 bg-white shadow-inner">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} WalletTrack. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
