// components/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Edit2, Save, X, Camera } from "lucide-react";

const Profile = ({ userRole = "user" }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      address: userData.address || "",
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to update profile
      // const response = await updateProfile(formData);
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffffff&color=3B82F6&size=100`}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md">
              <Camera className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-blue-100">
              {user.role === "admin" ? "Administrator" : "Customer"} Account
            </p>
            <p className="text-sm text-blue-100">
              Member since {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Profile Information
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
            <div className="sm:w-32 flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">Full Name</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="flex-1 mt-1 sm:mt-0 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="flex-1 text-gray-800">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
            <div className="sm:w-32 flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Email</span>
            </div>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 mt-1 sm:mt-0 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="flex-1 text-gray-800">{user.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
            <div className="sm:w-32 flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">Phone</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="flex-1 mt-1 sm:mt-0 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="flex-1 text-gray-800">
                {user.phone || "Not provided"}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col sm:flex-row sm:items-center py-2">
            <div className="sm:w-32 flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Role</span>
            </div>
            <p className="flex-1">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.role === "admin" ? "Administrator" : "Customer"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Account Status</h3>
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-xs text-gray-500 mt-2">
            Last login: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Account Type</h3>
          <p className="text-sm text-gray-600">
            {user.role === "admin"
              ? "Full admin access"
              : "Standard customer account"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
