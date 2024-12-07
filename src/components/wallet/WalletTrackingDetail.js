import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, ExternalLink, Loader } from "lucide-react";
import axios from "../../lib/axios";
import WalletBalanceTable from "../admin/WalletBalanceTable";
import FeatureRestricted from "../restricted/FeatureRestricted";

const WalletTrackingDetail = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await axios.get(`/wallets/trackable-coins/${coinId}`);
        setCoin(response.data);
      } catch (err) {
        console.error("Error fetching coin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [coinId]);

  if (loading)
    return (
      <div className="flex justify-center p-6">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <FeatureRestricted feature="wallet_tracking">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Wallet Tracking Table
          </h2>
          <button
            onClick={() => navigate("/wallet-tracking")}
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
            Wallets Overview
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-6">
            <img
              src={coin?.image}
              alt={coin?.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{coin?.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">
                  {coin?.symbol?.toUpperCase()}
                </span>
                <span className="text-2xl font-medium">
                  ${parseFloat(coin?.price).toFixed(2).toLocaleString()}
                </span>
                <div
                  className={`flex items-center ${
                    coin?.price_change_24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {coin?.price_change_24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(coin?.price_change_24h)}%
                </div>
                <a
                  href={coin?.coingecko_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on CoinGecko
                </a>
              </div>
            </div>
          </div>
        </div>

        <WalletBalanceTable selectedCoin={coinId} selectedChain="all" />
      </div>
    </FeatureRestricted>
  );
};

export default WalletTrackingDetail;
