import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Loader } from "lucide-react";
import axios from "../../lib/axios";

const Portfolio = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleCoinClick = (coingecko_id) => {
    navigate(`/dashboard/coin/${coingecko_id}`);
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
        <h1 className="text-2xl font-bold text-gray-100">Crypto Portfolio</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coins.map((coin) => (
          <div
            key={coin.coingecko_id}
            onClick={() => handleCoinClick(coin.coingecko_id)}
            className="bg-[#222] border border-[#333] rounded-xl p-6 hover:bg-[#333] cursor-pointer transition-colors"
          >
            <div className="flex flex-col space-y-4 items-center text-center">
              <img
                src={coin.image}
                alt={coin.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-100">
                  {coin.name}
                </h3>
                <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-100">
                  ${parseFloat(coin.current_price).toFixed(3).toLocaleString()}
                </p>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    coin.price_change_percentage_24h >= 0
                      ? "bg-green-800 text-green-200"
                      : "bg-red-800 text-red-200"
                  }`}
                >
                  {coin.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
