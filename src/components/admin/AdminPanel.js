import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div
          onClick={() => navigate("/admin/coins")}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Coin Management</h2>
          <p className="text-gray-600">
            Add and edit cryptocurrency information
          </p>
        </div>
        <div
          onClick={() => navigate("/admin/posts")}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-gray-600">Manage posts and content for coins</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
