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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-yellow-100 p-3">
            <ClockIcon className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Account Pending Activation
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your account is currently being reviewed.
          </p>
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              Please wait while an administrator verifies and activates your
              account. This process may take some time. You'll be able to access
              all features once your account is activated. Please log out
              through the button below and try again later or wait until u are
              notified. by the admin.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingActivation;
