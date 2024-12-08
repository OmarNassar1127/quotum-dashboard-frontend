import React from "react";
import { ClockIcon, LogOut } from "lucide-react";
import axios from "../../lib/axios";

const PendingActivation = () => {
  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("active");
      setTimeout(() => window.location.reload(), 400);
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("active");
      setTimeout(() => window.location.reload(), 400);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="bg-[#111] rounded-lg shadow-lg max-w-lg w-full p-8 text-center">
        {/* Icon Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-yellow-200 p-4">
            <ClockIcon className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Account Pending Activation
          </h2>
        </div>

        {/* Message Section */}
        <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-6">
          <p className="text-base text-yellow-800 leading-relaxed">
            Your account is currently under review by an administrator. This
            process may take some time. Once your account is activated, you will
            be notified via email or by the admins and gain access to all features.
          </p>
        </div>

        {/* Instructions */}
        <p className="mt-6 text-gray-400">
          Please log out and try again later or wait for a notification from the
          admin. Thank you for your patience!
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default PendingActivation;
