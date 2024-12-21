import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight } from "lucide-react";
import axios from "../../lib/axios";
import quotumLogo from "../../assets/quotum-no-bg.png";
import { DeviceLimitDialog } from "./DeviceManagement";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showDeviceLimitDialog, setShowDeviceLimitDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/login", formData);

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("active", response.data.user.active.toString());
      localStorage.setItem("user_id", response.data.user.id);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;

      if (!response.data.user.active) {
        navigate("/");
        return;
      }

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response?.data?.errors?.device) {
        setShowDeviceLimitDialog(true);
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeviceLimitDialogClose = () => {
    setShowDeviceLimitDialog(false);
    navigate("/account/devices");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md bg-[#111] rounded-lg shadow-lg p-8 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={quotumLogo}
            alt="Quotum Logo"
            className="w-[250px] h-auto"
          />
          <h2 className="text-2xl font-bold text-white text-center">
            Login with your email
          </h2>
          <p className="text-sm text-gray-400 text-center">
            Enter your email address and your password to access your account.
          </p>
        </div>

        {error && (
          <div
            className="rounded-md bg-red-50 border border-red-300 text-red-600 px-4 py-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <User className="h-5 w-5" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center pt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="inline-flex items-center font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign up
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </p>

        <DeviceLimitDialog
          open={showDeviceLimitDialog}
          onClose={handleDeviceLimitDialogClose}
        />
      </div>
    </div>
  );
};

export default Login;
