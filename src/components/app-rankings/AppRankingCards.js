import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader, AlertCircle } from "lucide-react";
import axios from "../../lib/axios";

const AppRankingCards = () => {
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/platform/app-rankings");
      setRankings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load rankings");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const RankingCard = ({ app }) => {
    const isPositiveChange = app.change_percentage > 0;

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-xl" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">{app.name}</h3>
            <p className="text-xs text-gray-500">App Store Ranking</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex flex-col items-end mb-1">
            <p className="text-xl font-bold text-gray-900">
              #{app.current_rank}
            </p>
            <p className="text-xs text-gray-500">Current Rank</p>
          </div>

          <div
            className={`flex items-center text-sm ${
              isPositiveChange ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="font-medium">
              {isPositiveChange ? "+" : "-"}
              {Math.abs(app.change_percentage)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <RankingCard app={rankings.coinbase} />
      <RankingCard app={rankings.phantom} />
    </div>
  );
};

export default AppRankingCards;
