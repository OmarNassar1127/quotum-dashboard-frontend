import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Layout,
  Settings,
  Database,
  FileText,
  LogOut,
  User,
  Menu,
  ChartArea,
  Binoculars,
  X,
  Coins,
  Link as LinkIcon,
} from "lucide-react";
import axios from "../lib/axios";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { title: "Dashboard", icon: Layout, path: "/admin" },
    { title: "Coin Management", icon: Database, path: "/admin/coins" },
    { title: "Post Management", icon: FileText, path: "/admin/posts" },
    { title: "User Settings", icon: Settings, path: "/admin/user-settings" },
    {
      title: "Wallet Tracker",
      icon: Binoculars,
      path: "/admin/wallet-trackers",
    },
    { title: "Wallet Chart", icon: ChartArea, path: "/admin/wallet-chart" },
    { title: "Referral", icon: LinkIcon, path: "/admin/referral" },
    { title: "Coin Suggestions", icon: Coins, path: "/admin/coin-suggestions" },
    { title: "User panel", icon: User, path: "/" },
  ];

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
    <div className="flex h-screen bg-[#111] text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 bg-[#222] border-r border-[#333] shadow-sm transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 md:w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-[#333]">
            <h1 className="text-xl font-bold text-gray-100">Admin Panel</h1>
          </div>
          <nav className="flex-1 p-4 overflow-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-[#333]"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-[#333]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="h-16 bg-[#222] border-b border-[#333] flex items-center px-6 sticky top-0 z-30">
          <button
            onClick={toggleSidebar}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-gray-100 ml-4 md:ml-0">
            {menuItems.find((item) => item.path === location.pathname)?.title ||
              "Admin"}
          </h2>
        </div>

        {/* Content Area */}
        <main className="p-6 overflow-auto flex-1">
          <Outlet />
        </main>
      </div>

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
