import React, { useState, useEffect } from "react";
import axios from "../../lib/axios";
import {
  AlertCircle,
  TrendingDown,
  Loader2,
  Info,
  ArrowDownCircle,
} from "lucide-react";
import { format } from "date-fns";

const SellPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indicators, setIndicators] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate trigger status based on thresholds
  const calculateTriggerStatus = (type, rawValue) => {
    const value =
      typeof rawValue === "number" ? rawValue : parseFloat(rawValue || 0);
    const thresholds = {
      coinbase: {
        green: 5,
        orange: 30,
        red: 31,
      },
      phantom: {
        green: 5,
        orange: 30,
        red: 31,
      },
      altseason: {
        green: 65,
        orange: 60,
        red: 50,
      },
      nupl: {
        green: 0.71,
        orange: 0.6,
        red: 0.6,
      },
      risk: {
        green: 0.75,
        orange: 0.6,
        red: 0.6,
      },
    };

    const threshold = thresholds[type];
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ArrowDownCircle className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold">Market Sell Triggers</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-[#222] rounded-xl border border-[#333] text-gray-400 font-medium">
            <div>Trigger Name</div>
            <div>Hold</div>
            <div>Conservative TP</div>
            <div>Max TP</div>
          </div>

          {/* Indicators */}
          {indicators && (
            <div className="space-y-4">
              <TriggerRow
                name="Coinbase App Store Rank"
                description="Tracks Coinbase's app store rank as a proxy for retail interest"
                status={calculateTriggerStatus(
                  "coinbase",
                  indicators.app_rankings.coinbase.current_rank
                )}
                current={indicators.app_rankings.coinbase.current_rank}
                thresholds={{
                  hold: "Above 30",
                  conservative: "6-30",
                  max: "Top 5",
                }}
              />

              <TriggerRow
                name="Phantom Wallet App Store Rank"
                description="Tracks Phantom's app store rank as a proxy for retail interest"
                status={calculateTriggerStatus(
                  "phantom",
                  indicators.app_rankings.phantom.current_rank
                )}
                current={indicators.app_rankings.phantom.current_rank}
                thresholds={{
                  hold: "Above 30",
                  conservative: "6-30",
                  max: "Top 5",
                }}
              />

              <TriggerRow
                name="Alt Season Index"
                description="The Alt Season Index measures when altcoins outperform BTC"
                status={calculateTriggerStatus(
                  "altseason",
                  indicators.altcoin_index?.value
                )}
                current={indicators.altcoin_index?.value}
                thresholds={{
                  hold: "Below 50",
                  conservative: "50-60",
                  max: "Above 65",
                }}
              />

              <TriggerRow
                name="Bitcoin NUPL"
                description="Net Unrealized Profit/Loss indicates market-wide profit taking"
                status={calculateTriggerStatus(
                  "nupl",
                  parseFloat(indicators.nupl?.value) || 0
                )}
                current={
                  typeof indicators.nupl?.value === "number"
                    ? indicators.nupl.value.toFixed(2)
                    : typeof indicators.nupl?.value === "string"
                    ? parseFloat(indicators.nupl.value).toFixed(2)
                    : "0.00"
                }
                thresholds={{
                  hold: "Below 0.6",
                  conservative: "0.6-0.71",
                  max: "Above 0.71",
                }}
              />

              <TriggerRow
                name="BTC Mathematical Risk Level"
                description="Risk metric based on predefined price levels"
                status={calculateTriggerStatus(
                  "risk",
                  indicators.risk_level?.value || 0
                )}
                current={
                  indicators.risk_level?.value
                    ? indicators.risk_level.value.toFixed(3)
                    : "0.000"
                }
                thresholds={{
                  hold: "Below 0.6",
                  conservative: "0.6-0.75",
                  max: "Above 0.75",
                }}
              />
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-[#222] rounded-xl border border-[#333]">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold">About These Triggers</h2>
          </div>
          <div className="space-y-4 text-gray-400 text-sm">
            <p>
              This dashboard combines multiple market indicators to help
              identify potential market tops and optimal times to take profit.
              Each indicator is color-coded based on its signal strength:
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

        {indicators && (
          <div className="mt-4 text-right text-sm text-gray-500">
            Last updated:{" "}
            {format(new Date(indicators.updated_at), "MMM d, yyyy HH:mm:ss")}
          </div>
        )}
      </div>
    </div>
  );
};

const TriggerRow = ({ name, description, status, current, thresholds }) => {
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
    <div className="grid grid-cols-4 gap-4 p-4 bg-[#222] rounded-xl border border-[#333] items-center">
      <div>
        <h3 className="font-medium text-gray-200">{name}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
          <span className="font-medium text-white">{current}</span>
        </div>
      </div>
      <div className="text-gray-300">{thresholds.conservative}</div>
      <div className="text-gray-300">{thresholds.max}</div>
    </div>
  );
};

export default SellPage;
