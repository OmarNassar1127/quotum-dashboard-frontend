import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader, AlertCircle } from "lucide-react";
import axios from "../../lib/axios";

const CoinManagement = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    image: "",
    coingecko_link: "",
    coingecko_id: "",
  });

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/coins");
      setCoins(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load coins. Please try again.");
      console.error("Error fetching coins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/coins", formData);
      setFormData({
        name: "",
        symbol: "",
        image: "",
        coingecko_link: "",
        coingecko_id: "",
      });
      setShowForm(false);
      await fetchCoins();
    } catch (err) {
      setError("Failed to create coin. Please try again.");
      console.error("Error creating coin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (coinId) => {
    if (window.confirm("Are you sure you want to delete this coin?")) {
      try {
        setLoading(true);
        await axios.delete(`/coins/${coinId}`);
        await fetchCoins();
      } catch (err) {
        setError("Failed to delete coin. Please try again.");
        console.error("Error deleting coin:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coin Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Coin
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Coin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbol
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CoinGecko Link
              </label>
              <input
                type="url"
                value={formData.coingecko_link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coingecko_link: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                The CoinGecko page URL for this coin
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CoinGecko ID
              </label>
              <input
                type="text"
                value={formData.coingecko_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coingecko_id: e.target.value.toLowerCase(),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                The ID used in CoinGecko's API (e.g., "bitcoin", "ethereum")
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Coin
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coins.map((coin) => (
          <div key={coin.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={coin.image_url}
                  alt={coin.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {coin.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {coin.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(coin.id)}
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                CoinGecko ID: {coin.coingecko_id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinManagement;
