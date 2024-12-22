import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Lock, Mail, ArrowLeft, UserPlus } from "lucide-react";
import axios from "../../lib/axios";
import quotumLogo from "../../assets/quotum-no-bg.png";

const Register = () => {
  const location = useLocation(); // for reading ?ref=...
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // We'll initialize referral_code as an empty string;
  // then in a useEffect we look for ?ref= in the URL
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: "",
  });

  // When the component mounts (and whenever location changes),
  // parse the "ref" query param and update referral_code
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refParam = params.get("ref");
    if (refParam) {
      setFormData((prevData) => ({
        ...prevData,
        referral_code: refParam,
      }));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Adjust your fields as needed if your API expects different keys
      const response = await axios.post("/register", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        referral_code: formData.referral_code,
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="flex flex-col md:flex-row bg-[#111] rounded-lg shadow-lg max-w-4xl w-full">
        {/* Logo and Slogan Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 space-y-4 text-center from-gray-800 to-gray-900">
          <img
            src={quotumLogo}
            alt="Quotum Logo"
            className="w-[250px] h-auto"
          />
          <h2 className="text-3xl font-bold text-white">
            Empowering Your Goals
          </h2>
          <p className="text-gray-400 text-sm">
            Join Quotum and unlock your potential with smart solutions tailored
            just for you.
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:flex items-center">
          <div className="w-px h-[80%] bg-gray-700"></div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-white text-center">
            Create your Quotum account
          </h2>
          <p className="text-sm text-gray-400 text-center mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="inline-flex items-center font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>
          </p>

          {error && (
            <div
              className="rounded-md bg-red-50 border border-red-300 text-red-600 px-4 py-3 text-sm mt-4"
              role="alert"
            >
              {error}
            </div>
          )}

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* First Name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md 
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="First name"
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md 
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Last name"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md 
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Email address"
                />
              </div>

              {/* Password */}
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
                  className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md 
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Password"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md 
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Confirm password"
                />
              </div>

              {/* Referral Code (Auto-populated if ?ref=... in URL) */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <UserPlus className="h-5 w-5" />
                </span>
                <input
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  value={formData.referral_code}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-white placeholder-gray-400 bg-[#1a1a1a] border border-[#333] rounded-md 
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Referral code (optional)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
