import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-col justify-center min-h-screen bg-gray-50">
      {/* Decorative Background Shape */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-br-full opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-tr from-green-100 to-green-200 rounded-tl-full opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">StockPilot</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl">
          Simplify your stock market journey. Get real-time insights, analytics, and tools to make smarter investment decisions—all in one platform.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/login">
            <button className="px-12 py-5 text-2xl font-semibold bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-120 ">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-12 py-5 text-2xl font-semibold bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition transform hover:scale-120 ">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 