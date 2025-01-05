import React, { useState, useEffect } from "react";
import { Loader, AlertCircle, Check, X } from "lucide-react";
import axios from "../../lib/axios";

const CoinSuggestionManagement = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/suggestions");
      setSuggestions(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load suggestions. Please try again.");
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (suggestionId, resolved) => {
    try {
      setLoading(true);
      await axios.patch(`/suggestions/${suggestionId}/resolved`, { resolved });
      await fetchSuggestions();
    } catch (err) {
      setError("Failed to update suggestion status. Please try again.");
      console.error("Error updating suggestion:", err);
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

  const renderSuggestionCard = (suggestion) => (
    <div
      key={suggestion.id}
      className="bg-[#222] border border-[#333] rounded-lg shadow-sm p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">
            {suggestion.coin_name}
          </h3>
          <div className="mt-1">
            <a
              href={suggestion.coingecko_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View on CoinGecko
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {suggestion.resolved ? (
            <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded">
              Resolved
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-400 rounded">
              Pending
            </span>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-400 mb-4">
        <p>
          Suggested by:{" "}
          {suggestion.user
            ? `${suggestion.user.first_name} ${suggestion.user.last_name}`
            : "Anonymous"}
        </p>
        <p>Email: {suggestion.user?.email || "N/A"}</p>
        <p className="mt-1">
          Submitted: {new Date(suggestion.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        {!suggestion.resolved ? (
          <button
            onClick={() => handleStatusUpdate(suggestion.id, true)}
            className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            Mark Resolved
          </button>
        ) : (
          <button
            onClick={() => handleStatusUpdate(suggestion.id, false)}
            className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Mark Pending
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-[#111] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Coin Suggestions</h1>
      </div>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.length > 0 ? (
          suggestions.map(renderSuggestionCard)
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            No coin suggestions found
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinSuggestionManagement;
