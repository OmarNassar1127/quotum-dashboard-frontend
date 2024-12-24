import React, { useState, useEffect } from "react";
import { Loader, Calendar } from "lucide-react";
import axios from "../../lib/axios";

const OneOnOne = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [calendlyLink, setCalendlyLink] = useState(null);
  const [error, setError] = useState(null);
  const [showRestriction, setShowRestriction] = useState(false);

  useEffect(() => {
    const fetchCalendlyLink = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const response = await axios.get(`/meeting?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCalendlyLink(response.data.link);
        setError(null);
        setShowRestriction(false); // Reset restriction state if access is allowed
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("Feature not available in your subscription");
          setShowRestriction(true);
        } else if (err.response && err.response.status === 401) {
          setError("You are not authenticated. Please log in.");
          setShowRestriction(true);
        } else {
          setError("An unexpected error occurred. Please try again later.");
          setShowRestriction(true);
        }
        setCalendlyLink(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendlyLink();
  }, []);

  useEffect(() => {
    // Load Calendly widget script if link is available
    if (calendlyLink) {
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;

        document.body.appendChild(script);
      }
    }
  }, [calendlyLink]);

  return (
    <div className="p-6 space-y-6 bg-[#111] min-h-screen border border-[#222] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-[#32CD32]/20 p-3">
              <Calendar className="h-8 w-8 text-[#32CD32]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            Schedule Your One-on-One Session
          </h1>

          {/* Feature Content or Loader */}
          {isLoading ? (
            <div className="flex justify-center items-center h-[600px]">
              <Loader className="h-8 w-8 animate-spin text-[#32CD32]" />
            </div>
          ) : showRestriction ? (
            <div className="relative mt-4 flex items-center justify-center backdrop-blur-md p-6 rounded-lg shadow-lg max-w-lg mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Premium Feature
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() =>
                    (window.location.href = "mailto:quotum.consulting@gmail.com")
                  }
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          ) : (
            <div
              className="calendly-inline-widget"
              data-url={calendlyLink}
              style={{
                minWidth: "320px",
                height: "700px",
                backgroundColor: "#111",
              }}
            />
          )}
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#222]">
            <div className="rounded-full bg-blue-500/10 w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Personalized Strategy
            </h3>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#222]">
            <div className="rounded-full bg-purple-500/10 w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#222]">
            <div className="rounded-full bg-green-500/10 w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Portfolio Review</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneOnOne;
