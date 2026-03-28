import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[500px] text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Welcome</h1>

        <p className="text-gray-600 mb-8">
          Please login or register to continue
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
