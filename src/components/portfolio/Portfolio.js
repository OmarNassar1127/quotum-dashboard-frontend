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
      setCoins(response.data); // Directly use the response data
      setError(null);
    } catch (err) {
      setError("Failed to load coins. Please try again.");
      console.error("Error fetching coins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCoinClick = (coingecko_id) => {
    navigate(`/coin/${coingecko_id}`); // Pass the `coingecko_id` directly
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Crypto Portfolio</h1>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-2"
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
            key={coin.coingecko_id} // Use `coingecko_id` directly as the key
            onClick={() => handleCoinClick(coin.coingecko_id)} // Navigate with `coingecko_id`
            className="bg-white shadow-sm rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {coin.name}
                </h3>
                <p className="text-sm text-gray-500">{coin.symbol}</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  ${parseFloat(coin.current_price).toFixed(3).toLocaleString()}
                </p>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    coin.price_change_percentage_24h >= 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
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
