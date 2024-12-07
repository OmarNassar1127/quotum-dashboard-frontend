import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import axios from "../../lib/axios";
import FeatureRestricted from "../restricted/FeatureRestricted";

const CoinCard = ({ coin, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-4">
      <img
        src={coin.image}
        alt={coin.name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h3 className="font-medium text-gray-900">{coin.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {coin.symbol.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-sm text-gray-500">
            {coin.wallet_count} wallets
          </span>
        </div>
      </div>
    </div>
  </div>
);

const WalletTracking = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackableCoins = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/wallets/trackable-coins");
        setCoins(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load trackable coins");
        console.error("Error fetching coins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackableCoins();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <FeatureRestricted feature="wallet_tracking">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Wallet Tracking
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <CoinCard
              key={coin.coin_id}
              coin={coin}
              onClick={() => navigate(`/wallet-tracking/${coin.coin_id}`)}
            />
          ))}
        </div>

        {coins.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No trackable coins found
          </div>
        )}
      </div>
    </FeatureRestricted>
  );
};

export default WalletTracking;
