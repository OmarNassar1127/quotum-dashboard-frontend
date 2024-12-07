import React, { useState, useEffect } from "react";
import {
  Activity,
  Database,
  User,
  Video,
  Wallet,
  FileText,
  ToggleLeft,
  ToggleRight,
  Search,
} from "lucide-react";
import axios from "../../lib/axios";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_coins: 0,
    total_posts: 0,
    total_users: 0,
    recent_posts: [],
    recent_users: [],
  });

  const [postFilter, setPostFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [postSearch, setPostSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/stats");
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/admin/users/${userId}/toggle-status`);
      await fetchStats();
    } catch (err) {
      setError("Failed to update user status.");
      console.error("Error updating user status:", err);
    }
  };

  const filteredPosts = stats.recent_posts
    .filter((post) =>
      postFilter === "all" ? true : post.status === postFilter
    )
    .filter((post) =>
      postSearch
        ? post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
          post.coin_name.toLowerCase().includes(postSearch.toLowerCase())
        : true
    );

  const filteredUsers = stats.recent_users
    .filter((user) =>
      userFilter === "all" ? true : user.active === (userFilter === "active")
    )
    .filter((user) =>
      userSearch
        ? user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearch.toLowerCase())
        : true
    );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Total Coins</h3>
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
            {stats.total_coins}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Total Posts</h3>
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
            {stats.total_posts}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Total Users</h3>
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
            {stats.total_users}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">
                Wallets being tracked
              </h3>
            </div>
          </div>
          <p className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
          {stats.total_wallets}
          </p>
        </div>
      </div>

      {/* Recent Posts and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Posts
              </h2>
            </div>
            <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                />
              </div>
              <select
                value={postFilter}
                onChange={(e) => setPostFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.coin_name} •{" "}
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Users
              </h2>
            </div>
            <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                />
              </div>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email} •{" "}
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => toggleUserStatus(user.id, user.active)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {user.active ? (
                    <>
                      <ToggleRight className="h-4 w-4 text-green-500" />
                      <span className="text-green-700">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 text-red-500" />
                      <span className="text-red-700">Inactive</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
