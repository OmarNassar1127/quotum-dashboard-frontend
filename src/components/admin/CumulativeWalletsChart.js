import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "../../lib/axios";

const CumulativeWalletsChart = ({ selectedCoin }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, [selectedCoin]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/wallets/chart", {
        params: { coin_id: selectedCoin },
      });

      const transformedData = response.data.map((item) => ({
        date: item.date,
        Exchanges: item.exchanges || 0,
        Whales: item.whales || 0,
        Large: item.large || 0,
        Medium: item.medium || 0,
        Small: item.small || 0,
      }));
      setChartData(transformedData);

      setError(null);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (val) => {
    const value = Number(val);
    if (!Number.isFinite(value)) {
      return "-";
    }

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }

    return value.toFixed(2);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-[#222] border border-[#333] rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 font-medium mb-2">{label}</p>
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span
              className="flex items-center gap-2"
              style={{ color: entry.color }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-medium" style={{ color: entry.color }}>
              {formatValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-[#111] text-white">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-[#111] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="h-96 w-full bg-[#222] border border-[#333] rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#666"
            tick={{ fill: "#666" }}
            tickLine={{ stroke: "#666" }}
          />
          <YAxis
            stroke="#666"
            tick={{ fill: "#666" }}
            tickLine={{ stroke: "#666" }}
            tickFormatter={(value) => {
              // Convert to millions
              const inMillions = value / 1_000_000;
              // Round to nearest whole number
              const rounded = Math.round(inMillions);
              return `${rounded}M`;
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: "#666",
            }}
          />
          <Area
            type="monotone"
            dataKey="Exchanges"
            stackId="1"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="Whales"
            stackId="1"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="Large"
            stackId="1"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="Medium"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="Small"
            stackId="1"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeWalletsChart;
