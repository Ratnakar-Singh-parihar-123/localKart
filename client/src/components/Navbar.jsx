import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  User,
  LogOut,
  Package,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Store,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    setUser(userData);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { path: "/", label: "Home", icon: Home },
        { path: "/login", label: "Login", icon: User },
        { path: "/register", label: "Register", icon: User },
      ];
    }

    if (user.role === "admin") {
      return [
        { path: "/", label: "Home", icon: Home },
        { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
      ];
    }

    // User role
    return [
      { path: "/", label: "Home", icon: Home },
      { path: "/user", label: "Dashboard", icon: Store },
    ];
  };

  const getProfileInfo = () => {
    if (!user) return null;

    return {
      name: user.name || (user.role === "admin" ? "Admin" : "User"),
      email: user.email || "",
      role: user.role === "admin" ? "Administrator" : "Customer",
      avatar:
        user.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.role)}&background=3B82F6&color=fff`,
    };
  };

  const navLinks = getNavLinks();
  const profileInfo = getProfileInfo();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition"
          >
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="hidden sm:inline">LocalKart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="hidden md:block relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={profileInfo.avatar}
                  alt={profileInfo.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-gray-700">
                    {profileInfo.name}
                  </p>
                  <p className="text-xs text-gray-500">{profileInfo.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={profileInfo.avatar}
                          alt={profileInfo.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                        />
                        <div>
                          <p className="text-white font-semibold">
                            {profileInfo.name}
                          </p>
                          <p className="text-blue-100 text-sm">
                            {profileInfo.email}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                            {profileInfo.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Links */}
                    <div className="p-2">
                      <Link
                        to={
                          user.role === "admin"
                            ? "/admin/profile"
                            : "/user/profile"
                        }
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            My Profile
                          </p>
                          <p className="text-xs text-gray-500">
                            View and edit your profile
                          </p>
                        </div>
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          to="/admin/settings"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Settings
                            </p>
                            <p className="text-xs text-gray-500">
                              Manage your preferences
                            </p>
                          </div>
                        </Link>
                      )}

                      <div className="border-t border-gray-200 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <div>
                          <p className="text-sm font-medium">Logout</p>
                          <p className="text-xs text-red-500">
                            Sign out of your account
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {/* Mobile Nav Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile User Section */}
            {user && (
              <>
                <div className="border-t border-gray-200 my-2"></div>

                {/* Mobile Profile Info */}
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={profileInfo.avatar}
                      alt={profileInfo.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {profileInfo.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {profileInfo.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 rounded-full text-xs text-blue-600">
                        {profileInfo.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Profile Links */}
                <Link
                  to={
                    user.role === "admin" ? "/admin/profile" : "/user/profile"
                  }
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  My Profile
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
