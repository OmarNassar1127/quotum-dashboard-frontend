import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Activity,
  BarChart3,
  PieChart,
  Users,
  ArrowUpDown,
  Timer,
  Coins,
} from "lucide-react";
import axios from "../../lib/axios";

const Onchain = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({
    favorites: true,
    monthly: true,
    other: false,
  });

  const tools = {
    favorites: [
      {
        name: "Bitcoin Risk Levels",
        description: "Dynamic risk levels for limit orders",
        route: "/dashboard/onchain/bitcoin-risk-levels",
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        name: "NUPL",
        description: "Net Unrealized Profit/Loss analysis",
        route: "/dashboard/onchain/nupl",
        icon: <BarChart3 className="w-4 h-4" />,
      },
      {
        name: "Short Term Bubble",
        description: "Price risk visualization with 20-week SMA",
        route: "/dashboard/onchain/short-term-bubble",
        icon: <Activity className="w-4 h-4" />,
      },
      {
        name: "Bitcoin Retail",
        description: "Retail investor spending patterns",
        route: "/dashboard/onchain/bitcoin-retail",
        icon: <Coins className="w-4 h-4" />,
      },
    ],
    monthly: [
      {
        name: "Others.d vs BTC",
        description: "Market dominance analysis",
        route: "/dashboard/onchain/others-vs-btc",
        icon: <PieChart className="w-4 h-4" />,
      },
      {
        name: "Bitcoin Waves",
        description: "Halving cycles analysis",
        route: "/dashboard/onchain/bitcoin-waves",
        icon: <Activity className="w-4 h-4" />,
      },
      {
        name: "ETF Daily Flows",
        description: "Track ETF holder activities",
        route: "/dashboard/onchain/etf-inflows",
        icon: <ArrowUpDown className="w-4 h-4" />,
      },
    ],
    other: [
      {
        name: "ETF Volumes",
        description: "Cumulative ETF volume tracking",
        route: "/dashboard/onchain/etf",
        icon: <BarChart3 className="w-4 h-4" />,
      },
      {
        name: "Short Term Holders",
        description: "Under 155 days holder analysis",
        route: "/dashboard/onchain/short-term-holders",
        icon: <Timer className="w-4 h-4" />,
      },
      {
        name: "Long Term Holders",
        description: "Over 155 days holder patterns",
        route: "/dashboard/onchain/long-term-holders",
        icon: <Users className="w-4 h-4" />,
      },
      {
        name: "Active Addresses",
        description: "Network activity monitoring",
        route: "/dashboard/onchain/bitcoin-active-addresses",
        icon: <Users className="w-4 h-4" />,
      },
    ],
  };

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

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSection = (title, tools, section) => (
    <div className="mb-6">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3 px-3 text-gray-300 hover:text-white transition-all border border-[#222] rounded-lg hover:bg-[#222] hover:border-[#333] group"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">{title}</span>
        </div>
        {openSections[section] ? (
          <ChevronUp className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-all transform group-hover:-translate-y-0.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-all transform group-hover:translate-y-0.5" />
        )}
      </button>

      {openSections[section] && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              onClick={() => navigate(tool.route)}
              className="bg-[#222] hover:bg-[#282828] border border-[#333] rounded-lg transition-all duration-200 cursor-pointer group overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-gray-400 group-hover:text-gray-200 transition-colors">
                    {tool.icon}
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-white transition-colors">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-200 group-hover:text-gray-100 transition-colors">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111]">
        <Loader className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111] text-red-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#111] border border-[#222] text-white rounded-lg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Bitcoin Onchain</h1>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-[#222] border border-[#333] rounded-lg hover:bg-[#333] hover:text-white transition-colors"
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

      <div className="space-y-8">
        {renderSection("Quotum's Favorites", tools.favorites, "favorites")}
        {renderSection("Monthly Analysis", tools.monthly, "monthly")}
        {renderSection("Additional Indicators", tools.other, "other")}
      </div>
    </div>
  );
};

export default Onchain;
