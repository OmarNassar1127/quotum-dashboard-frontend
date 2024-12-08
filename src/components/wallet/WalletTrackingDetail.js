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

  if (loading) {
    return (
      <FeatureRestricted feature="wallet_tracking">
        <div className="flex justify-center items-center h-64 bg-[#111] text-white">
          <Loader className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      </FeatureRestricted>
    );
  }

  return (
    <FeatureRestricted feature="wallet_tracking">
      <div className="p-4 md:p-6 space-y-6 bg-[#111] border border-[#222] min-h-screen text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-100">
            Wallet Tracking Table
          </h2>
          <button
            onClick={() => navigate("/wallet-tracking")}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-[#222] border border-[#333] rounded-lg hover:bg-[#333] transition-colors"
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
            Wallets Overview
          </button>
        </div>

        <div className="bg-[#222] border border-[#333] rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <img
              src={coin?.image}
              alt={coin?.name}
              className="w-16 h-16 rounded-full border border-[#333]"
            />
            <div className="flex-1 space-y-2 sm:space-y-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-100 mb-1">
                  {coin?.name}
                </h1>
                <span className="text-gray-400 uppercase">
                  {coin?.symbol?.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-gray-300">
                <span className="text-xl sm:text-2xl font-medium text-gray-100">
                  ${parseFloat(coin?.price).toFixed(2).toLocaleString()}
                </span>

                <div
                  className={`flex items-center ${
                    coin?.price_change_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {coin?.price_change_24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(coin?.price_change_24h)}%
                </div>

                {coin?.coingecko_url && (
                  <a
                    href={coin?.coingecko_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center whitespace-nowrap transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on CoinGecko
                  </a>
                )}
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
