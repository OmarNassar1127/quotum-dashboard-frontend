import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { format } from "date-fns";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import axios from "../../lib/axios";

const formatNumberToUSLocale = (value) => {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "K";
  }
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
};

const WalletBalanceTable = ({ selectedCoin, selectedChain }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "balance",
    direction: "desc",
  });

  useEffect(() => {
    fetchWalletStats();
  }, [selectedCoin, selectedChain]);

  const fetchWalletStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/wallets/stats", {
        params: {
          coin_id: selectedCoin,
          chain: selectedChain !== "all" ? selectedChain : undefined,
        },
      });
      setWallets(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load wallet statistics");
      console.error("Error fetching wallet stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatPercentage = (value) => {
    const formattedValue = Number(value).toFixed(2);
    return (
      <div
        className={`flex items-center gap-1 ${
          value > 0
            ? "text-green-500"
            : value < 0
            ? "text-red-500"
            : "text-gray-500"
        }`}
      >
        {value > 0 ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : value < 0 ? (
          <ArrowDownIcon className="h-4 w-4" />
        ) : null}
        <span>{Math.abs(formattedValue)}%</span>
      </div>
    );
  };

  const getExplorerUrl = (address, chain) => {
    switch (chain.toLowerCase()) {
      case "ethereum":
        return `https://etherscan.io/address/${address}`;
      case "bsc":
        return `https://bscscan.com/address/${address}`;
      case "polygon":
        return `https://polygonscan.com/address/${address}`;
      default:
        return null;
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedWallets = () => {
    if (!sortConfig.key) return wallets;

    return [...wallets].sort((a, b) => {
      if (sortConfig.key.startsWith("changes.")) {
        const period = sortConfig.key.split(".")[1];
        const aValue = Number(a.changes[period]) || 0;
        const bValue = Number(b.changes[period]) || 0;
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      if (sortConfig.key === "balance") {
        return sortConfig.direction === "asc"
          ? a.balance - b.balance
          : b.balance - a.balance;
      }

      const aValue = String(a[sortConfig.key]).toLowerCase();
      const bValue = String(b[sortConfig.key]).toLowerCase();

      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const SortHeader = ({ label, sortKey }) => {
    const isActive = sortConfig.key === sortKey;
    return (
      <th
        className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-50"
        onClick={() => requestSort(sortKey)}
      >
        <div className="flex items-center gap-1">
          {label}
          <ArrowUpDown
            className={`h-4 w-4 ${
              isActive ? "text-indigo-600" : "text-gray-400"
            }`}
          />
        </div>
      </th>
    );
  };

  const AddressCell = ({ address, chain }) => {
    const explorerUrl = getExplorerUrl(address, chain);

    return (
      <td className="whitespace-nowrap px-4 py-3 font-mono text-sm">
        {explorerUrl ? (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
          >
            {formatAddress(address)}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          formatAddress(address)
        )}
      </td>
    );
  };

  if (loading) {
    return <div className="mt-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="mt-4 text-red-500">{error}</div>;
  }

  const sortedWallets = getSortedWallets();

  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <SortHeader label="Wallet" sortKey="label" />
              <th className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-500">
                Address
              </th>
              <SortHeader label="Balance" sortKey="balance" />
              <SortHeader label="Chain" sortKey="chain" />
              <SortHeader label="24h %" sortKey="changes.24h" />
              <SortHeader label="7d %" sortKey="changes.7d" />
              <SortHeader label="2w %" sortKey="changes.2w" />
              <SortHeader label="1m %" sortKey="changes.1m" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedWallets.map((wallet) => (
              <tr key={wallet.address} className="hover:bg-gray-50 bg-white">
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        wallet.is_exchange ? "bg-orange-400" : "bg-indigo-400"
                      }`}
                    />
                    {wallet.label}
                  </div>
                </td>
                <AddressCell address={wallet.address} chain={wallet.chain} />
                <td className="whitespace-nowrap px-4 py-3">
                  {formatNumberToUSLocale(wallet.balance)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 uppercase">
                  {wallet.chain}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatPercentage(wallet.changes["24h"])}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatPercentage(wallet.changes["7d"])}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatPercentage(wallet.changes["2w"])}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatPercentage(wallet.changes["1m"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletBalanceTable;