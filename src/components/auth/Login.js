import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Sun, Moon } from "lucide-react";
import axios from "../../lib/axios";
import quotumLogo from "../../assets/quotum-no-bg.png";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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

    try {
      if (isForgotPassword) {
        const response = await axios.post("/forgot-password", {
          email: forgotPasswordEmail,
        });
        setForgotPasswordSuccess(response.data.message);
        setError("");
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
      className={`min-h-screen flex items-center justify-center px-4 py-12 sm:py-8 ${
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
        className={`w-full max-w-sm sm:max-w-md ${
          theme === "dark" ? "bg-[#111]" : "bg-white"
        } rounded-lg shadow-lg p-6 sm:p-8 space-y-6`}
      >
        <div className="flex justify-center items-center">
          <img
            src={quotumLogo}
            alt="Quotum Logo"
            className="w-[180px] sm:w-[250px] h-auto"
          />
        </div>

        <h2
          className={`text-lg sm:text-2xl font-bold text-center ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {isForgotPassword ? "Forgot Password" : "Login with your email"}
        </h2>

        <p
          className={`text-xs sm:text-sm text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {isForgotPassword
            ? "Enter your email to reset your password."
            : "Enter your email address and your password to access your account."}
        </p>

        {error && (
          <div
            className="rounded-md bg-red-50 border border-red-300 text-red-600 px-4 py-3 text-xs sm:text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {forgotPasswordSuccess && (
          <div
            className="rounded-md bg-green-50 border border-green-300 text-green-600 px-4 py-3 text-xs sm:text-sm"
            role="alert"
          >
            {forgotPasswordSuccess}
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
                value={isForgotPassword ? forgotPasswordEmail : formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 text-xs sm:text-sm ${
                  theme === "dark"
                    ? "text-white placeholder-gray-400 bg-[#1a1a1a] border-[#333]"
                    : "text-gray-900 placeholder-gray-500 bg-white border-gray-300"
                } rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
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
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 text-xs sm:text-sm ${
                    theme === "dark"
                      ? "text-white placeholder-gray-400 bg-[#1a1a1a] border-[#333]"
                      : "text-gray-900 placeholder-gray-500 bg-white border-gray-300"
                  } rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                  placeholder="Password"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-xs sm:text-sm rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
          >
            {isForgotPassword ? "Send Reset Email" : "Log In"}
          </button>
        </form>

        {!isForgotPassword && (
          <p
            className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 text-center cursor-pointer"
            onClick={() => setIsForgotPassword(true)}
          >
            Forgot Password?
          </p>
        )}

        {isForgotPassword && (
          <p
            className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 text-center cursor-pointer"
            onClick={() => setIsForgotPassword(false)}
          >
            Back to Login
          </p>
        )}

        <p
          className={`text-xs sm:text-sm text-center pt-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="inline-flex items-center font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign up
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
