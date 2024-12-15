import React, { useState, useEffect } from "react";
import {
  Plus,
  Loader,
  AlertCircle,
  Trash2,
  Edit,
  Search,
  ArrowUpDown,
  AlertTriangle,
} from "lucide-react";
import axios from "../../lib/axios";

const WalletManagement = () => {
  const [groupedWallets, setGroupedWallets] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState({ field: null, direction: "asc" });
  const [showApiLimitWarning, setShowApiLimitWarning] = useState(false);
  const [apiLimitDetails, setApiLimitDetails] = useState(null);
  const ITEMS_PER_PAGE = 20;

  const [formData, setFormData] = useState({
    address: "",
    label: "",
    coin_id: "",
    chain: "",
    chain_id: "",
    is_exchange: false,
    notes: "",
  });

  const [availableChains, setAvailableChains] = useState([]);
  const [editingWallet, setEditingWallet] = useState(null);
  const [pendingSubmission, setPendingSubmission] = useState(null);

  useEffect(() => {
    fetchGroupedWallets();
    fetchCoins();
  }, []);

  const fetchGroupedWallets = async () => {
    try {
      const response = await axios.get("/wallets");
      const walletsWithCollapseState = response.data.grouped_wallets.map(
        (group) => ({
          ...group,
          isCollapsed: true,
        })
      );
      setGroupedWallets(walletsWithCollapseState || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching wallets:", err);
      setError("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoins = async () => {
    try {
      const response = await axios.get("/coins");
      const validCoins = response.data.filter(
        (coin) =>
          Array.isArray(coin.smart_contracts) && coin.smart_contracts.length > 0
      );
      setCoins(validCoins);
    } catch (err) {
      console.error("Error fetching coins:", err);
      setError("Failed to load coins");
    }
  };

  const handleCoinChange = (coinId) => {
    const selectedCoin = coins.find((coin) => coin.id === parseInt(coinId, 10));
    const smartContracts = selectedCoin?.smart_contracts || [];

    setFormData({
      ...formData,
      coin_id: coinId,
      chain: "",
      chain_id: "",
    });

    setAvailableChains(
      smartContracts.map(({ chain, chain_id }) => ({ chain, chain_id }))
    );
  };

  const getChainId = (chain) => {
    if (!chain || typeof chain !== "string") {
      console.error("Invalid chain value:", chain);
      return null;
    }

    const chainMapping = {
      ethereum: 1,
      bsc: 56,
      polygon: 137,
    };
    return chainMapping[chain.toLowerCase()];
  };

  const checkApiLimits = async (chain) => {
    console.log("Checking API limits for chain:", chain, "type:", typeof chain);

    try {
      const chainId = getChainId(chain);
      if (!chainId) {
        console.error("Unsupported chain:", chain);
        return false;
      }

      const response = await axios.get(`/wallets/check-api-limits/${chainId}`);
      const { currentCalls, isWithinLimit, estimatedDailyCalls } =
        response.data;

      if (!isWithinLimit) {
        setApiLimitDetails({
          currentCalls,
          estimatedDailyCalls,
          limit: 100000,
          chain,
        });
        setShowApiLimitWarning(true);
        setPendingSubmission({ ...formData });
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error checking API limits:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const dataToSubmit = pendingSubmission || formData;

    if (!pendingSubmission) {
      const withinLimits = await checkApiLimits(dataToSubmit.chain);
      if (!withinLimits) return;
    }

    try {
      const payload = {
        address: dataToSubmit.address,
        label: dataToSubmit.label,
        coin_id: dataToSubmit.coin_id,
        chain: dataToSubmit.chain,
        is_exchange: dataToSubmit.is_exchange,
        is_active: true, // Changed from active to is_active
        notes: dataToSubmit.notes,
      };

      if (editingWallet) {
        await axios.put(`/wallets/${editingWallet.id}`, payload);
      } else {
        await axios.post("/wallets", payload);
      }
      resetForm();
      await fetchGroupedWallets();
    } catch (err) {
      setError("Failed to save wallet");
      console.error("Error saving wallet:", err);
    } finally {
      setPendingSubmission(null);
    }
  };

  const handleChainChange = (chain) => {
    const selectedChain = availableChains.find((c) => c.chain === chain);
    console.log("Selected chain:", selectedChain);

    setFormData({
      ...formData,
      chain: selectedChain.chain,
    });
  };

  const resetForm = () => {
    setFormData({
      address: "",
      label: "",
      coin_id: "",
      chain: "",
      chain_id: "",
      is_exchange: false,
      notes: "",
    });
    setAvailableChains([]);
    setShowForm(false);
    setEditingWallet(null);
    setPendingSubmission(null);
    setShowApiLimitWarning(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wallet?")) return;
    try {
      await axios.delete(`/wallets/${id}`);
      await fetchGroupedWallets();
    } catch (err) {
      setError("Failed to delete wallet");
      console.error("Error deleting wallet:", err);
    }
  };

  const ApiLimitWarningModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
        showApiLimitWarning ? "" : "hidden"
      }`}
    >
      <div className="bg-[#222] border border-[#333] rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">
            API Limit Warning
          </h3>
        </div>

        <div className="text-gray-300 mb-6">
          <p className="mb-2">
            Adding this wallet could exceed the API call limits for this
            blockchain:
          </p>
          {apiLimitDetails && (
            <ul className="list-disc pl-5 space-y-1">
              <li>Current daily calls: {apiLimitDetails.currentCalls}</li>
              <li>
                Estimated daily calls after adding:{" "}
                {apiLimitDetails.estimatedDailyCalls}
              </li>
              <li>Daily limit: {apiLimitDetails.limit}</li>
            </ul>
          )}
          <p className="mt-2">
            Adding this wallet might affect the ability to track balances
            accurately. Consider removing unused wallets first.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setShowApiLimitWarning(false);
              setPendingSubmission(null);
            }}
            className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowApiLimitWarning(false);
              handleSubmit();
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Add Anyway
          </button>
        </div>
      </div>
    </div>
  );

  const getExplorerUrl = (chain, address) => {
    const explorers = {
      ethereum: `https://etherscan.io/address/${address}`,
      bsc: `https://bscscan.com/address/${address}`,
      polygon: `https://polygonscan.com/address/${address}`,
    };
    return explorers[chain.toLowerCase()] || "#";
  };

  const handleSort = (field) => {
    setSortBy((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filterAndSortWallets = (wallets) => {
    let filtered = wallets;

    if (searchTerm) {
      filtered = wallets.filter((wallet) =>
        wallet.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy.field) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        if (sortBy.field === "amount") {
          comparison = a.current_balance - b.current_balance;
        } else if (sortBy.field === "chain") {
          comparison = a.chain.localeCompare(b.chain);
        }
        return sortBy.direction === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111] text-white">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-[#111] text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Wallet Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Wallet
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-[#222] border border-[#333] rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">
            {editingWallet ? "Edit Wallet" : "Add New Wallet"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Coin
              </label>
              <select
                value={formData.coin_id}
                onChange={(e) => handleCoinChange(e.target.value)}
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Coin</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Chain
              </label>
              <select
                value={formData.chain}
                onChange={(e) => handleChainChange(e.target.value)}
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!availableChains.length}
              >
                <option value="">Select a Chain</option>
                {availableChains.map(({ chain }) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Exchange
              </label>
              <select
                value={formData.is_exchange.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_exchange: e.target.value === "true",
                  })
                }
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-[#333] text-gray-200 bg-[#222] rounded-lg hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingWallet ? "Update Wallet" : "Add Wallet"}
              </button>
            </div>
          </form>
        </div>
      )}

      {groupedWallets.map((group, index) => (
        <div
          key={index}
          className="bg-[#222] border border-[#333] rounded-lg shadow-md p-4 mb-4"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => {
              const updated = [...groupedWallets];
              updated[index].isCollapsed = !updated[index].isCollapsed;
              setGroupedWallets(updated);
            }}
          >
            <div className="flex items-center space-x-4">
              <img
                src={group.coin_logo}
                alt={group.coin_name}
                className="w-8 h-8 border border-[#333] rounded-full"
              />
              <h3 className="text-xl font-bold text-gray-100">
                {group.coin_name} ({group.wallets.length} addresses)
              </h3>
            </div>
            {group.isCollapsed ? (
              <ArrowUpDown className="h-5 w-5 text-gray-300 rotate-180 transform" />
            ) : (
              <ArrowUpDown className="h-5 w-5 text-gray-300" />
            )}
          </div>

          {!group.isCollapsed && (
            <>
              <div className="mt-4 mb-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search by label..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={() => handleSort("amount")}
                    className="px-4 py-2 border border-[#333] rounded-lg flex items-center space-x-2 hover:bg-[#333] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>Amount</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleSort("chain")}
                    className="px-4 py-2 border border-[#333] rounded-lg flex items-center space-x-2 hover:bg-[#333] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>Chain</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {(() => {
                  const filtered = filterAndSortWallets(group.wallets);
                  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                  const endIndex = startIndex + ITEMS_PER_PAGE;
                  const paginatedWallets = filtered.slice(startIndex, endIndex);
                  const totalPages = Math.ceil(
                    filtered.length / ITEMS_PER_PAGE
                  );

                  return (
                    <>
                      <div className="space-y-2">
                        {paginatedWallets.map((wallet) => (
                          <div
                            key={wallet.id}
                            className="flex justify-between items-center bg-[#1a1a1a] rounded-lg p-3"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-medium text-gray-100">
                                  {wallet.label}
                                </h4>
                                {wallet.is_exchange && (
                                  <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                                    Exchange
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <a
                                  href={getExplorerUrl(
                                    wallet.chain,
                                    wallet.address
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 hover:underline"
                                >
                                  {wallet.address}
                                </a>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingWallet(wallet);
                                      setFormData({
                                        address: wallet.address,
                                        label: wallet.label,
                                        coin_id: wallet.coin_id.toString(),
                                        chain: wallet.chain,
                                        is_exchange: wallet.is_exchange,
                                        notes: wallet.notes || "",
                                      });
                                      setShowForm(true);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-400 focus:outline-none"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(wallet.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-400 focus:outline-none"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <img
                                  src={wallet.chain_logo}
                                  alt={wallet.chain}
                                  className="w-5 h-5 border border-[#333] rounded-full"
                                />
                                <span className="text-sm text-gray-300">
                                  {wallet.chain}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-100">
                                {wallet.current_balance.toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#333]">
                          <p className="text-sm text-gray-300">
                            Showing {startIndex + 1} to{" "}
                            {Math.min(endIndex, filtered.length)} of{" "}
                            {filtered.length} wallets
                          </p>
                          <div className="flex space-x-2">
                            {currentPage > 1 && (
                              <button
                                onClick={() =>
                                  setCurrentPage((curr) => curr - 1)
                                }
                                className="px-3 py-1 rounded bg-[#333] text-gray-200 hover:bg-[#444]"
                              >
                                Previous
                              </button>
                            )}
                            {Array.from({ length: totalPages }, (_, i) => {
                              const pageNumber = i + 1;
                              if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 &&
                                  pageNumber <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`px-3 py-1 rounded ${
                                      currentPage === pageNumber
                                        ? "bg-blue-600 text-white"
                                        : "bg-[#333] text-gray-200 hover:bg-[#444]"
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                );
                              } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                              ) {
                                return (
                                  <span
                                    key={pageNumber}
                                    className="px-2 text-gray-400"
                                  >
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            })}
                            {currentPage < totalPages && (
                              <button
                                onClick={() =>
                                  setCurrentPage((curr) => curr + 1)
                                }
                                className="px-3 py-1 rounded bg-[#333] text-gray-200 hover:bg-[#444]"
                              >
                                Next
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      ))}

      <ApiLimitWarningModal />
    </div>
  );
};

export default WalletManagement;
