import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import axios from "../../lib/axios";

const Onchain = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example on-chain tools data:
  const tools = [
    {
      name: "Bitcoin Risk Levels",
      description:
        "Shows various risk levels projected onto the price. Useful for setting dynamic limit orders at different risk levels.",
      route: "/onchain/bitcoin-risk-levels",
    },
    {
      name: "Bitcoin Waves",
      description:
        "Shows wave bands following Bitcoin's halving cycles, mapping price oscillations onto logarithmic trends. Each band represents different market phases, helping identify potential tops and bottoms for strategic entry and exit points.",
      route: "/onchain/bitcoin-waves",
    },
    {
      name: "NUPL",
      description:
        "The Net Unrealized Profit Loss (NUPL) indicator is a powerful tool for analyzing Bitcoin market sentiment and cycles",
      route: "/onchain/nupl",
    },
    {
      name: "ETF Volumes",
      description:
        "The ETF Volumes shows the cumulative volume in Bitcoin ETFs, with this we now what major players of the markets are doing!",
      route: "/onchain/etf",
    },
  ];

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const response = await axios.get("/platform/coins");
      setCoins(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load coins. Please try again.");
      console.error("Error fetching coins:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111] text-white">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-300 bg-[#111]">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#111] min-h-screen border border-[#222] text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Bitcoin Onchain</h1>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-[#222] border border-[#333] rounded-lg hover:bg-[#333] hover:text-white focus:outline-none transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Home
        </button>
      </div>

      {/* On-chain tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.name}
            onClick={() => navigate(tool.route)}
            className="bg-[#222] border border-[#333] p-6 rounded-lg shadow-sm hover:bg-[#333] transition-colors cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-100">
              {tool.name}
            </h2>
            <p className="text-sm text-gray-300">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Onchain;
