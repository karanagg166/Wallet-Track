"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-blue-100 shadow-md">
        <div className="text-2xl font-bold text-blue-600">WalletTrack</div>
        <div className="flex gap-4">
          <div
            onClick={() => router.push("/login")}
            className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            Login
          </div>
          <div
            onClick={() => router.push("/signup")}
            className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            Sign Up
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-6 py-12 md:px-20 bg-gray-50">
        {/* Text Content */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Welcome to <span className="text-blue-600">WalletTrack!</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Your personal finance tracker to manage income, expenses, and savings effortlessly.
          </p>
          <div
            onClick={() => router.push("/dashboard")}
            className="w-fit bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition"
          >
            Get Started
          </div>
        </div>

        {/* Illustration */}
        <div className="mb-8 md:mb-0">
          <img
            src="/10944902.png"
            alt="Finance Illustration"
            className="w-full max-w-md"
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
