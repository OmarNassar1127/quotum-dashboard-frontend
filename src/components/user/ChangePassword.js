import React, { useState } from "react";
import { AlertCircle, Loader, X } from "lucide-react";
import axios from "../../lib/axios";

const ChangePassword = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== verifyPassword) {
      setError("New password and verification do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/users/reset-password", {
        current_password: currentPassword,
        new_password: newPassword,
        verify_password: verifyPassword,
      });
      setSuccess("Password changed successfully.");
      setTimeout(() => onClose(), 2000); // Auto-close on success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#222] border border-[#333] rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-100">
          Change Password
        </h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 text-green-300 flex items-center mb-4">
            {success}
          </div>
        )}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded-lg p-2 text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded-lg p-2 text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">
              Verify New Password
            </label>
            <input
              type="password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded-lg p-2 text-gray-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
