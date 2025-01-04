import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, AlertCircle, PlusCircle } from "lucide-react";
import axios from "../../lib/axios";
import FeatureRestricted from "../restricted/FeatureRestricted";
import CoinSuggestionModal from "./CoinSuggestionModal"; // Add this import

const CoinCard = ({ coin, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#222] border border-[#333] rounded-xl p-6 cursor-pointer hover:bg-[#333] transition-colors"
  >
    <div className="flex items-center gap-4">
      <img
        src={coin.image}
        alt={coin.name}
        className="w-12 h-12 rounded-full border border-[#333]"
      />
      <div>
        <h3 className="font-medium text-gray-100">{coin.name}</h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="uppercase">{coin.symbol.toUpperCase()}</span>
          <span className="text-xs">•</span>
          <span>{coin.wallet_count} wallets</span>
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64 text-gray-300">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      );
    }

    return (
      <>
        {coins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.map((coin) => (
              <CoinCard
                key={coin.coin_id}
                coin={coin}
                onClick={() => navigate(`/wallet-tracking/${coin.coin_id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-8">
            No trackable coins found
          </div>
        )}
      </>
    );
  };

  return (
    <FeatureRestricted feature="wallet_tracking">
      <div className="p-6 bg-[#111] min-h-screen text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Wallet Tracking</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Request New Coin
          </button>
        </div>
        {renderContent()}
        <CoinSuggestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </FeatureRestricted>
  );
};

export default WalletTracking;
