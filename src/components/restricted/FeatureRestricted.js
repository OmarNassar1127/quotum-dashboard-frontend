import React, { useState, useEffect } from "react";
import axios from "../../lib/axios";

const FeatureRestricted = ({ children }) => {
  const [showRestriction, setShowRestriction] = useState(false);
  const isAdmin = localStorage.getItem("role") === "admin";

  useEffect(() => {
    // Don't set up error interceptor for admins
    if (isAdmin) return;

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 403 &&
          error.response?.data?.message ===
            "Feature not available in your subscription"
        ) {
          setShowRestriction(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [isAdmin]);

  if (isAdmin || !showRestriction) {
    return children;
  }

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 backdrop-blur-[6px] bg-white/30 rounded-lg z-10">
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Premium Feature
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade your subscription to access this chart
            </p>
            <button
              onClick={() =>
                (window.location.href = "mailto:admin@example.com")
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Contact Admin
            </button>
          </div>
        </div>
      </div>
      <div className="blur-sm pointer-events-none h-full">{children}</div>
    </div>
  );
};

export default FeatureRestricted;
