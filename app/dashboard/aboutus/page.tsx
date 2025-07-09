export default function AnalysisBoard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About Us
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          We are passionate software developers committed to building clean and
          innovative solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Harsh Mishra */}
          <div className="flex flex-col items-center bg-gray-100 rounded-xl p-6 hover:shadow-md transition">
            <img
              src="/Avatar_Icon.png"
              alt="Harsh Mishra"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Harsh Mishra
            </h2>
            <p className="text-gray-600 text-center">
              Software Developer | MERN Stack | Competitive Programmer
            </p>
          </div>

          {/* Karan Aggarwal */}
          <div className="flex flex-col items-center bg-gray-100 rounded-xl p-6 hover:shadow-md transition">
            <img
              src="/Avatar_Icon.png"
              alt="Karan Aggarwal"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Karan Aggarwal
            </h2>
            <p className="text-gray-600 text-center">
              Software Developer | Backend Specialist | Cloud Enthusiast
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
