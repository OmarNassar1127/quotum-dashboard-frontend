import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Sun, Moon, Loader2 } from "lucide-react";
import axios from "../../lib/axios";
import quotumLogo from "../../assets/quotum-no-bg.png";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        const response = await axios.post("/forgot-password", {
          email: forgotPasswordEmail,
        });
        setForgotPasswordSuccess(response.data.message);
        setError("");

        // Wait for 2 seconds to show success message
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Refresh the page to return to login
        window.location.reload();
        return;
      }

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
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    if (isForgotPassword) {
      setForgotPasswordEmail(e.target.value);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        theme === "dark" ? "bg-black" : "bg-gray-100"
      }`}
    >
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full border border-gray-400 hover:bg-gray-200 transition-all"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-800" />
        )}
      </button>
      <div
        className={`flex flex-col md:flex-row ${
          theme === "dark" ? "bg-[#111]" : "bg-white"
        } rounded-lg shadow-lg max-w-4xl w-full`}
      >
        {/* Logo Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 space-y-4 text-center">
          <img
            src={quotumLogo}
            alt="Quotum Logo"
            className="w-[250px] h-auto"
          />
          <h2
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome Back!
          </h2>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } text-sm`}
          >
            Access your Quotum account and continue your journey with us.
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:flex items-center">
          <div className="w-px h-[80%] bg-gray-700"></div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2
            className={`text-2xl font-bold text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {isForgotPassword ? "Forgot Password" : "Login to Your Account"}
          </h2>
          <p
            className={`text-sm text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {isForgotPassword
              ? "Enter your email to reset your password."
              : "Enter your email and password to log in."}
          </p>

          {error && (
            <div
              className="rounded-md bg-red-50 border border-red-300 text-red-600 px-4 py-3 text-sm mt-4"
              role="alert"
            >
              {error}
            </div>
          )}

          {forgotPasswordSuccess && (
            <div
              className="rounded-md bg-green-50 border border-green-300 text-green-600 px-4 py-3 text-sm mt-4"
              role="alert"
            >
              {forgotPasswordSuccess}
            </div>
          )}

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
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
                  disabled={isLoading}
                  value={
                    isForgotPassword ? forgotPasswordEmail : formData.email
                  }
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 ${
                    theme === "dark"
                      ? "text-white placeholder-gray-400 bg-[#1a1a1a] border-white"
                      : "text-gray-900 placeholder-gray-500 bg-white border-black"
                  } rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Email Address"
                />
              </div>

              {!isForgotPassword && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 ${
                      theme === "dark"
                        ? "text-white placeholder-gray-400 bg-[#1a1a1a] border-white"
                        : "text-gray-900 placeholder-gray-500 bg-white border-black"
                    } rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    placeholder="Password"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Please wait...
                </span>
              ) : isForgotPassword ? (
                "Send Reset Email"
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {!isForgotPassword && (
            <p
              className={`text-sm text-blue-400 hover:text-blue-300 text-center cursor-pointer mt-4 ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => !isLoading && setIsForgotPassword(true)}
            >
              Forgot Password?
            </p>
          )}

          {isForgotPassword && (
            <p
              className={`text-sm text-blue-400 hover:text-blue-300 text-center cursor-pointer mt-4 ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => !isLoading && setIsForgotPassword(false)}
            >
              Back to Login
            </p>
          )}

          <p
            className={`text-sm text-center pt-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`inline-flex items-center font-medium text-blue-400 hover:text-blue-300 transition-colors ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Sign up
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
