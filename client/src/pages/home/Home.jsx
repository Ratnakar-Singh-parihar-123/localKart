import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <ShoppingBag className="w-10 h-10 text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome to ShopHub
          </h1>

          <p className="text-gray-600 mb-8">
            {user
              ? `Welcome back, ${user.name}!`
              : "Please login or register to continue"}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  navigate(user.role === "admin" ? "/admin" : "/user")
                }
                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </button>
            )}
          </div>

          {/* Role Info (when logged in) */}
          {user && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Logged in as{" "}
                <span className="font-medium text-gray-700">{user.email}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1 capitalize">
                Role: {user.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
