import React, { useState, useEffect } from "react";
import {
  Activity,
  Database,
  User,
  Wallet,
  FileText,
  Upload,
  X,
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
    total_wallets: 0,
    recent_posts: [],
    recent_users: [],
  });

  const [postFilter, setPostFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [postSearch, setPostSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [csvProcessing, setCsvProcessing] = useState(false);

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

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploadStatus({
        type: "loading",
        message: "Uploading stablecoin data...",
      });
      setCsvProcessing(true);

      const response = await axios.post("/admin/stablecoins", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus({
        type: "success",
        message: response.data.message,
      });

      await fetchStats();

      setTimeout(() => {
        setShowUploader(false);
        setUploadStatus(null);
      }, 2000);
    } catch (err) {
      setUploadStatus({
        type: "error",
        message:
          err.response?.data?.message || "Failed to upload stablecoin data",
      });
    } finally {
      setCsvProcessing(false);
    }
  };

  const StablecoinUploader = () => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "text/csv") {
        await handleFileUpload(file);
      } else {
        setUploadStatus({
          type: "error",
          message: "Please upload a CSV file",
        });
      }
    };

    const handleFileSelect = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await handleFileUpload(file);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#222] border border-[#333] rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-100">
              Upload Stablecoin Data
            </h3>
            <button
              onClick={() => {
                setShowUploader(false);
                setUploadStatus(null);
              }}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-blue-500 bg-[#1a1a1a]" : "border-[#333]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="text-blue-400 hover:text-blue-300">
                  Click to upload
                </span>
                <span className="text-gray-400"> or drag and drop</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={uploadStatus?.type === "loading"}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              CSV files only, up to 2MB
            </p>
          </div>

          {uploadStatus && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                uploadStatus.type === "success"
                  ? "bg-green-900/20 text-green-300"
                  : uploadStatus.type === "error"
                  ? "bg-red-900/20 text-red-300"
                  : "bg-blue-900/20 text-blue-300"
              }`}
            >
              {uploadStatus.message}
            </div>
          )}
        </div>
      </div>
    );
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
    <div className="space-y-6 p-4 sm:p-6 bg-[#111] text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-100">Dashboard</h1>
        <button
          onClick={() => setShowUploader(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Stablecoin Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      {csvProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-200">Processing CSV...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#222] border border-[#333] rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-100">Total Coins</h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-100">
            {stats.total_coins}
          </p>
        </div>

        <div className="bg-[#222] border border-[#333] rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-100">Total Posts</h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-100">
            {stats.total_posts}
          </p>
        </div>

        <div className="bg-[#222] border border-[#333] rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center">
            <User className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-100">Total Users</h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-100">
            {stats.total_users}
          </p>
        </div>

        <div className="bg-[#222] border border-[#333] rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-100">
              Wallets being tracked
            </h3>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-100">
            {stats.total_wallets || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <div className="bg-[#222] border border-[#333] rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-100">
                Recent Posts
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                placeholder="Search posts..."
                className="px-3 py-2 border border-[#333] bg-[#111] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />
              <select
                value={postFilter}
                onChange={(e) => setPostFilter(e.target.value)}
                className="px-3 py-2 border border-[#333] bg-[#111] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
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
                className="flex justify-between items-center p-4 bg-[#1a1a1a] rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {post.coin_name} •{" "}
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === "published"
                      ? "bg-green-800 text-green-200"
                      : "bg-yellow-800 text-yellow-200"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#222] border border-[#333] rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-100">
                Recent Users
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="px-3 py-2 border border-[#333] bg-[#111] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="px-3 py-2 border border-[#333] bg-[#111] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
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
                className="flex justify-between items-center p-4 bg-[#1a1a1a] rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.email} •{" "}
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => toggleUserStatus(user.id, user.active)}
                  className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${
                    user.active
                      ? "bg-green-800 text-green-200"
                      : "bg-red-800 text-red-200"
                  }`}
                >
                  {user.active ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUploader && <StablecoinUploader />}
    </div>
  );
};

export default AdminDashboard;
