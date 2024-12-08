import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-[#111] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-[#222] border border-[#333] p-6 rounded-lg shadow-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-100">
            User Management
          </h2>
          <p className="text-sm text-gray-300">
            Manage user accounts and permissions
          </p>
        </div>
        <div
          onClick={() => navigate("/admin/coins")}
          className="bg-[#222] border border-[#333] p-6 rounded-lg shadow-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-100">
            Coin Management
          </h2>
          <p className="text-sm text-gray-300">
            Add and edit cryptocurrency information
          </p>
        </div>
        <div
          onClick={() => navigate("/admin/posts")}
          className="bg-[#222] border border-[#333] p-6 rounded-lg shadow-sm hover:bg-[#333] transition-colors cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-100">
            Content Management
          </h2>
          <p className="text-sm text-gray-300">
            Manage posts and content for coins
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
