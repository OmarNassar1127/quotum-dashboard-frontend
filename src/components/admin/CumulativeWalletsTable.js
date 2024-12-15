import React, { useState, useEffect } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import axios from "../../lib/axios";

const CumulativeWalletsTable = ({ selectedCoin }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletStats, setWalletStats] = useState(null);

  // Function to return thresholds based on coin ID
  const getThresholds = (coinId) => {
    // RIO thresholds (example: coin_id = 1)
    if (parseInt(coinId, 10) === 1) {
      return {
        WHALE: 1000000, // >1M tokens
        LARGE: 500000, // 500K-1M tokens
        MEDIUM: 100000, // 100K-500K tokens
      };
    }
    // GHX thresholds (default)
    return {
      WHALE: 5000000, // >5M tokens
      LARGE: 1000000, // 1M-5M tokens
      MEDIUM: 500000, // 500K-1M tokens
    };
  };

  useEffect(() => {
    fetchCumulativeStats();
  }, [selectedCoin]);

  const fetchCumulativeStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/wallets/stats", {
        params: {
          coin_id: selectedCoin,
        },
      });

      const wallets = response.data.filter((wallet) => wallet.is_active !== 0);
      const thresholds = getThresholds(selectedCoin);

      const categories = {
        exchanges: {
          wallets: wallets.filter((w) => w.is_exchange === 1),
          totalBalance: 0,
          changes: { "24h": 0, "7d": 0, "2w": 0, "1m": 0 },
        },
        whales: {
          wallets: wallets.filter(
            (w) =>
              w.is_exchange === 0 && parseFloat(w.balance) >= thresholds.WHALE
          ),
          totalBalance: 0,
          changes: { "24h": 0, "7d": 0, "2w": 0, "1m": 0 },
        },
        large: {
          wallets: wallets.filter(
            (w) =>
              w.is_exchange === 0 &&
              parseFloat(w.balance) >= thresholds.LARGE &&
              parseFloat(w.balance) < thresholds.WHALE
          ),
          totalBalance: 0,
          changes: { "24h": 0, "7d": 0, "2w": 0, "1m": 0 },
        },
        medium: {
          wallets: wallets.filter(
            (w) =>
              w.is_exchange === 0 &&
              parseFloat(w.balance) >= thresholds.MEDIUM &&
              parseFloat(w.balance) < thresholds.LARGE
          ),
          totalBalance: 0,
          changes: { "24h": 0, "7d": 0, "2w": 0, "1m": 0 },
        },
        small: {
          wallets: wallets.filter(
            (w) =>
              w.is_exchange === 0 && parseFloat(w.balance) < thresholds.MEDIUM
          ),
          totalBalance: 0,
          changes: { "24h": 0, "7d": 0, "2w": 0, "1m": 0 },
        },
      };

      // Calculate totals and weighted average changes
      Object.keys(categories).forEach((category) => {
        const { wallets } = categories[category];
        if (wallets.length === 0) return;

        // Total balance
        categories[category].totalBalance = wallets.reduce((sum, wallet) => {
          return sum + parseFloat(wallet.balance || 0);
        }, 0);

        // Weighted changes
        ["24h", "7d", "2w", "1m"].forEach((period) => {
          const totalWeightedChange = wallets.reduce((sum, wallet) => {
            const change = parseFloat(wallet.changes[period] || 0);
            const balance = parseFloat(wallet.balance || 0);
            return sum + change * balance;
          }, 0);

          const totalNonZeroBalance = wallets.reduce((sum, wallet) => {
            const balance = parseFloat(wallet.balance || 0);
            const change = parseFloat(wallet.changes[period] || 0);
            return change !== 0 ? sum + balance : sum;
          }, 0);

          categories[category].changes[period] =
            totalNonZeroBalance > 0
              ? totalWeightedChange / totalNonZeroBalance
              : 0;
        });
      });

      setWalletStats(categories);
      setError(null);
    } catch (err) {
      setError("Failed to load cumulative statistics");
      console.error("Error fetching cumulative stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumberToUSLocale = (value) => {
    if (!value) return "0";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (numValue >= 1_000_000) {
      return (numValue / 1_000_000).toFixed(2) + "M";
    }
    if (numValue >= 1_000) {
      return (numValue / 1_000).toFixed(2) + "K";
    }
    return numValue.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || value === 0) return "-";
    const formattedValue = Number(value).toFixed(2);
    let colorClass = "text-gray-400";
    let Icon = null;

    if (value > 0) {
      colorClass = "text-green-400";
      Icon = ArrowUpIcon;
    } else if (value < 0) {
      colorClass = "text-red-400";
      Icon = ArrowDownIcon;
    }

    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        {Icon && <Icon className="h-4 w-4" />}
        <span>{Math.abs(formattedValue)}%</span>
      </div>
    );
  };

  if (loading) {
    return <div className="mt-4 text-center text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="mt-4 text-red-300">{error}</div>;
  }

  const thresholds = getThresholds(selectedCoin);

  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-lg border border-[#333] bg-[#222]">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#222] border-b border-[#333]">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-300">
                Category
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-300">
                # of Wallets
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-300">
                Total Balance
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-300">
                24h %
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-300">
                7d %
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-300">
                2w %
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-300">
                1m %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {walletStats &&
              Object.entries(walletStats).map(([category, data]) => (
                <tr
                  key={category}
                  className="hover:bg-[#333] transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-3 capitalize">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          category === "exchanges"
                            ? "bg-orange-400"
                            : category === "whales"
                            ? "bg-purple-400"
                            : category === "large"
                            ? "bg-green-400"
                            : category === "medium"
                            ? "bg-blue-400"
                            : "bg-indigo-400"
                        }`}
                      />
                      <span className="text-gray-200">
                        {category === "exchanges"
                          ? "Exchanges"
                          : category === "whales"
                          ? `Whales (>${formatNumberToUSLocale(
                              thresholds.WHALE
                            )})`
                          : category === "large"
                          ? `Large (${formatNumberToUSLocale(
                              thresholds.LARGE
                            )}-${formatNumberToUSLocale(thresholds.WHALE)})`
                          : category === "medium"
                          ? `Medium (${formatNumberToUSLocale(
                              thresholds.MEDIUM
                            )}-${formatNumberToUSLocale(thresholds.LARGE)})`
                          : `Small (<${formatNumberToUSLocale(
                              thresholds.MEDIUM
                            )})`}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                    {data.wallets.length}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                    {formatNumberToUSLocale(data.totalBalance)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatPercentage(data.changes["24h"])}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatPercentage(data.changes["7d"])}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatPercentage(data.changes["2w"])}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatPercentage(data.changes["1m"])}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CumulativeWalletsTable;
