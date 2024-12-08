import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import axios from "../lib/axios";
import logo from "../assets/quotum-no-bg.png"; // Ensure correct path

const MainLayout = () => {
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

  // Common classes for nav items
  const baseLinkClasses =
    "block px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const inactiveClasses = "text-gray-300 hover:bg-[#222] hover:text-white";
  const activeClasses = "text-white bg-[#222] border-l-4 border-blue-500 pl-5";

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <div className="w-full bg-[#111] shadow-sm">
        <nav className="w-full relative h-16 flex items-center justify-between px-4 md:px-12">
          {/* Left Container (Brand) */}
          <div className="flex items-center space-x-3">
            <NavLink to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Quotum Logo" className="h-8 w-auto" />
              <span className="text-xl font-semibold text-white">
                Dashboard
              </span>
            </NavLink>
          </div>

          {/* Right Container - Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/wallet-tracking"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Wallet Tracker
            </NavLink>
            <NavLink
              to="/onchain"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              On-Chain
            </NavLink>
            <NavLink
              to="/videos"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Videos
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Help
            </NavLink>
            <NavLink
              to="/referrals"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              Referrals
            </NavLink>
            {userRole === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${
                    isActive
                      ? `text-white bg-[#222] border-l-4 border-blue-500 pl-5`
                      : "text-blue-400 hover:bg-[#222] hover:text-white"
                  }`
                }
              >
                Admin Panel
              </NavLink>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 ml-1 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#222] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-12 py-8">
        <Outlet />
      </div>

      {/* Side Drawer (Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 bg-[#111] shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 w-64 md:hidden flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-lg font-semibold text-white">Navigation</span>
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#222] focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-1 px-2 py-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={toggleSidebar}
          >
            Home
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={toggleSidebar}
          >
            Portfolio
          </NavLink>
          <NavLink
            to="/wallet-tracking"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={toggleSidebar}
          >
            Wallet Tracker
          </NavLink>
          <NavLink
            to="/onchain"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={toggleSidebar}
          >
            On-Chain
          </NavLink>
          <NavLink
            to="/videos"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={toggleSidebar}
          >
            Videos
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={toggleSidebar}
          >
            Help
          </NavLink>
          <NavLink
            to="/referrals"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={toggleSidebar}
          >
            Referrals
          </NavLink>
          {userRole === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive
                    ? `text-white bg-[#222] border-l-4 border-blue-500 pl-5`
                    : "text-blue-400 hover:bg-[#222] hover:text-white"
                }`
              }
              onClick={toggleSidebar}
            >
              Admin Panel
            </NavLink>
          )}
          <button
            onClick={() => {
              handleLogout();
              toggleSidebar();
            }}
            className="inline-flex items-center px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for sidebar */}
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
