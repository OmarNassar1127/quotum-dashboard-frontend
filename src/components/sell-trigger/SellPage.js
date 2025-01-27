import React, { useState, useEffect } from "react";
import axios from "../../lib/axios";
import {
  AlertCircle,
  Loader2,
  Info,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

// Your existing RSI computation function remains the same
function computeMonthlyRSI(monthlyData, period = 14) {
  if (!Array.isArray(monthlyData) || monthlyData.length < period + 1) {
    return null;
  }

  const sorted = [...monthlyData].sort((a, b) =>
    a.month.localeCompare(b.month)
  );
  const recent = sorted.slice(-1 * (period + 1));
  const closes = recent.map((item) => item.price);

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  if (avgGain === 0) return 0;

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return rsi;
}

const SellPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [monthlyRsi, setMonthlyRsi] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [thresholdSet, setThresholdSet] = useState("omar");
  const role = localStorage.getItem("role");

  // Your existing useEffect for market indicators
  useEffect(() => {
    const fetchMarketIndicators = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/market-indicators");
        setIndicators(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch market indicators");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketIndicators();
    const interval = setInterval(fetchMarketIndicators, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch monthly prices for RSI
  useEffect(() => {
    const fetchMonthlyPrices = async () => {
      try {
        const response = await axios.get("/platform/bitcoin/monthly");
        const rsiValue = computeMonthlyRSI(response.data, 14);
        setMonthlyRsi(rsiValue);
      } catch (err) {
        console.error("Failed to fetch monthly prices:", err);
      }
    };

    fetchMonthlyPrices();
  }, []);

  // Animation effect
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setAnimationComplete(true), 500);
    }
  }, [loading]);

  // Threshold configurations
  const thresholds = {
    omar: {
      coinbase: { green: 5, orange: 30, red: 31 },
      phantom: { green: 5, orange: 30, red: 31 },
      altseason: { green: 65, orange: 60, red: 50 },
      nupl: { green: 0.71, orange: 0.6, red: 0.6 },
      risk: { green: 0.75, orange: 0.6, red: 0.6 },
      monthlyRsi: { green: 84, orange: 60, red: 60 },
    },
    robin: {
      coinbase: { green: 3, orange: 10, red: 11 },
      phantom: { green: 30, orange: 50, red: 51 },
      altseason: { green: 80, orange: 75, red: 75 },
      nupl: { green: 70, orange: 65, red: 65 },
      risk: { green: 0.8, orange: 0.75, red: 0.75 },
      monthlyRsi: { green: 86, orange: 83, red: 83 },
    },
  };

  const calculateTriggerStatus = (type, rawValue) => {
    const value =
      typeof rawValue === "number" ? rawValue : parseFloat(rawValue || 0);

    // Use the selected threshold set (Omar or Robin)
    const threshold = thresholds[thresholdSet][type];
    if (!threshold) return "neutral";

    if (type === "coinbase" || type === "phantom") {
      return value <= threshold.green
        ? "max"
        : value <= threshold.orange
        ? "conservative"
        : "hold";
    }

    return value >= threshold.green
      ? "max"
      : value >= threshold.orange
      ? "conservative"
      : "hold";
  };

  const getStatusScore = (status) => {
    switch (status) {
      case "hold":
        return 0;
      case "conservative":
        return 1;
      case "max":
        return 2;
      default:
        return 1;
    }
  };

  const getCombinedScore = (allStatuses) => {
    if (!allStatuses || allStatuses.length === 0) return 1;
    const total = allStatuses.reduce((sum, s) => sum + getStatusScore(s), 0);
    return total / allStatuses.length;
  };

  const getCombinedPercentage = (avg) => {
    const clamped = Math.max(0, Math.min(2, avg));
    return (clamped / 2) * 100;
  };

  const getMarketStatusInfo = (score) => {
    if (score < 0.67) {
      return {
        icon: <TrendingDown className="w-6 h-6 text-red-500" />,
        text: "Hold",
        color: "text-red-500",
        description: "Multiple indicators suggest holding positions",
      };
    } else if (score < 1.33) {
      return {
        icon: <AlertCircle className="w-6 h-6 text-yellow-500" />,
        text: "Conservative",
        color: "text-yellow-500",
        description: "Consider taking some profits",
      };
    } else {
      return {
        icon: <TrendingUp className="w-6 h-6 text-green-500" />,
        text: "Take Profit",
        color: "text-green-500",
        description: "Strong sell signals across indicators",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  let allStatuses = [];
  let coinbaseStatus, phantomStatus, altSeasonStatus, nuplStatus, riskStatus;
  let monthlyRsiStatus = "neutral";

  if (indicators) {
    coinbaseStatus = calculateTriggerStatus(
      "coinbase",
      indicators.app_rankings.coinbase.current_rank
    );
    phantomStatus = calculateTriggerStatus(
      "phantom",
      indicators.app_rankings.phantom.current_rank
    );
    altSeasonStatus = calculateTriggerStatus(
      "altseason",
      indicators.altcoin_index?.value
    );
    nuplStatus = calculateTriggerStatus(
      "nupl",
      parseFloat(indicators.nupl?.value) || 0
    );
    riskStatus = calculateTriggerStatus(
      "risk",
      indicators.risk_level?.value || 0
    );

    allStatuses = [
      coinbaseStatus,
      phantomStatus,
      altSeasonStatus,
      nuplStatus,
      riskStatus,
    ];
  }

  if (monthlyRsi !== null) {
    monthlyRsiStatus = calculateTriggerStatus("monthlyRsi", monthlyRsi);
    allStatuses.push(monthlyRsiStatus);
  }

  const avgScore = getCombinedScore(allStatuses);
  const bigBandMarkerPosition = getCombinedPercentage(avgScore);
  const marketStatus = getMarketStatusInfo(avgScore);

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">Market Sell Triggers</h1>
          </div>
          {/* Admin toggle buttons */}
          {role === "admin" && (
            <div className="flex gap-2 bg-[#222] p-1 rounded-lg">
              <button
                onClick={() => setThresholdSet("omar")}
                className={`px-4 py-2 rounded-md ${
                  thresholdSet === "omar"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400"
                }`}
              >
                Omar
              </button>
              <button
                onClick={() => setThresholdSet("robin")}
                className={`px-4 py-2 rounded-md ${
                  thresholdSet === "robin"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400"
                }`}
              >
                Robin
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Triggers List */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#222] rounded-xl border border-[#333] text-gray-400 font-medium">
              <div>Trigger Name</div>
              <div>Status</div>
            </div>

            {indicators && (
              <div className="space-y-4">
                <TriggerRow
                  name="Coinbase App Store Rank"
                  description="Tracks Coinbase's app store rank as a proxy for retail interest"
                  status={coinbaseStatus}
                  current={indicators.app_rankings.coinbase.current_rank}
                />
                <TriggerRow
                  name="Phantom Wallet App Store Rank"
                  description="Tracks Phantom's app store rank as a proxy for retail interest"
                  status={phantomStatus}
                  current={indicators.app_rankings.phantom.current_rank}
                />
                <TriggerRow
                  name="Alt Season Index"
                  description="The Alt Season Index measures when altcoins outperform BTC"
                  status={altSeasonStatus}
                  current={indicators.altcoin_index?.value}
                />
                <TriggerRow
                  name="Bitcoin NUPL"
                  description="Net Unrealized Profit/Loss indicates market-wide profit taking"
                  status={nuplStatus}
                  current={
                    typeof indicators.nupl?.value === "number"
                      ? indicators.nupl.value.toFixed(2)
                      : typeof indicators.nupl?.value === "string"
                      ? parseFloat(indicators.nupl.value).toFixed(2)
                      : "0.00"
                  }
                />
                <TriggerRow
                  name="BTC Mathematical Risk Level"
                  description="Risk metric based on predefined price levels"
                  status={riskStatus}
                  current={
                    indicators.risk_level?.value
                      ? indicators.risk_level.value.toFixed(3)
                      : "0.000"
                  }
                />

                <TriggerRow
                  name="Bitcoin Monthly RSI"
                  description="14-month RSI calculated from monthly closing prices"
                  status={monthlyRsiStatus}
                  current={
                    monthlyRsi !== null ? monthlyRsi.toFixed(2) : "Loading..."
                  }
                />
              </div>
            )}
          </div>

          {/* Right Column - Market Status */}
          <div className="space-y-6">
            <div className="p-6 bg-[#222] rounded-xl border border-[#333]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Overall Market Status
                  </h2>
                  <p className="text-sm text-gray-400">
                    Combined analysis of all indicators
                  </p>
                </div>
                {marketStatus.icon}
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg mb-6">
                <div>
                  <div className="text-sm text-gray-400">Current Score</div>
                  <div className="text-2xl font-bold text-white">
                    {avgScore.toFixed(2)}/2.00
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Status</div>
                  <div className={`text-2xl font-bold ${marketStatus.color}`}>
                    {marketStatus.text}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="relative">
                  <div className="h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                    <div
                      className={`absolute top-0 -ml-4 transition-all duration-1000 ease-out ${
                        animationComplete ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ left: `${bigBandMarkerPosition}%` }}
                    >
                      <div className="relative">
                        <div className="absolute -top-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-full h-full flex justify-between px-4 pointer-events-none">
                    <div className="h-full w-px bg-white/20" />
                    <div className="h-full w-px bg-white/20" />
                    <div className="h-full w-px bg-white/20" />
                  </div>
                </div>

                <div className="flex justify-between px-4 text-sm text-gray-400">
                  <div>0.00</div>
                  <div>1.00</div>
                  <div>2.00</div>
                </div>
              </div>

              <div className="text-sm text-gray-400 bg-black/20 p-4 rounded-lg mb-6">
                {marketStatus.description}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                  <div className="text-red-500 font-medium">Hold</div>
                  <div className="text-gray-400">Score: 0</div>
                </div>
                <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                  <div className="text-yellow-500 font-medium">
                    Conservative
                  </div>
                  <div className="text-gray-400">Score: 1</div>
                </div>
                <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                  <div className="text-green-500 font-medium">Take Profit</div>
                  <div className="text-gray-400">Score: 2</div>
                </div>
              </div>
            </div>

            {/* About These Triggers */}
            <div className="p-6 bg-[#222] rounded-xl border border-[#333]">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">About These Triggers</h2>
              </div>
              <div className="space-y-4 text-gray-400 text-sm">
                <p>
                  This dashboard combines multiple market indicators to help
                  identify potential market tops and optimal times to take
                  profit. Each indicator is color-coded based on its signal
                  strength:
                </p>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Hold (Caution)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Conservative Take Profit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Maximum Take Profit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {indicators && (
          <div className="mt-8 text-right text-sm text-gray-500">
            Last updated:{" "}
            {format(new Date(indicators.updated_at), "MMM d, yyyy HH:mm:ss")}
          </div>
        )}
      </div>
    </div>
  );
};

const TriggerRow = ({ name, description, status, current }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "hold":
        return "bg-red-500";
      case "conservative":
        return "bg-yellow-500";
      case "max":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-[#222] rounded-xl border border-[#333] items-center">
      <div>
        <h3 className="font-medium text-gray-200">{name}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
        <span className="font-medium text-white">{current}</span>
      </div>
    </div>
  );
};

export default SellPage;
