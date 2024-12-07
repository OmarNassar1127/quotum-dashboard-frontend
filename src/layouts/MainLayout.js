import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import axios from "../lib/axios";

const MainLayout = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar - Now in its own container with explicit white background */}
      <div className="w-full bg-white shadow-sm">
        <nav className="w-full relative h-16">
          {/* Left Container */}
          <div className="absolute left-12 h-16 flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-800">
              Dashboard
            </Link>
          </div>

          {/* Right Container */}
          <div className="absolute right-12 h-16">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center h-full space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link
                to="/portfolio"
                className="text-gray-600 hover:text-gray-900"
              >
                Portfolio
              </Link>
              <Link
                to="/wallet-tracking"
                className="text-gray-600 hover:text-gray-900"
              >
                Wallet Tracker
              </Link>
              <Link to="/videos" className="text-gray-600 hover:text-gray-900">
                Videos
              </Link>
              <Link to="/help" className="text-gray-600 hover:text-gray-900">
                Help
              </Link>
              <Link
                to="/referrals"
                className="text-gray-600 hover:text-gray-900"
              >
                Referrals
              </Link>
              {userRole === "admin" && (
                <Link
                  to="/admin"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center h-full">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Content wrapper with gray background */}
      <div className="flex-1 bg-gray-50">
        {/* Main Content */}
        <main className="w-full max-w-none px-8 py-8">
          <Outlet />
        </main>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <span className="text-lg font-semibold text-gray-800">
              Navigation
            </span>
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-4 px-4 py-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              Home
            </Link>
            <Link
              to="/portfolio"
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              Portfolio
            </Link>
            <Link
              to="/wallet-tracking"
              className="text-gray-600 hover:text-gray-900"
            >
              Wallet Tracker
            </Link>
            <Link
              to="/videos"
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              Videos
            </Link>
            <Link
              to="/help"
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              Help
            </Link>
            <Link to="/referrals" className="text-gray-600 hover:text-gray-900">
              Referrals
            </Link>
            {userRole === "admin" && (
              <Link
                to="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={toggleSidebar}
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout();
                toggleSidebar();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to close sidebar when open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;
