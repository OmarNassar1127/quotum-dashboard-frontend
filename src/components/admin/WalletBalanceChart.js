import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { format } from "date-fns";
import { AlertCircle, Loader, TrendingUp } from "lucide-react";
import WalletBalanceTable from "./WalletBalanceTable";
import axios from "../../lib/axios";

const TIME_FRAMES = {
  "1h": 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
  "1m": 30 * 24 * 60 * 60 * 1000,
};

const WalletBalanceChart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("1d");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coins, setCoins] = useState([]);
  const [selectedChain, setSelectedChain] = useState("all");
  const [selectedExchangeFilter, setSelectedExchangeFilter] = useState("all");
  const [hiddenWallets, setHiddenWallets] = useState(new Set());
  const [yAxisMin, setYAxisMin] = useState("");
  const [yAxisMax, setYAxisMax] = useState("");

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get("/coins");
        setCoins(response.data);
        if (response.data.length > 0) {
          setSelectedCoin(response.data[0].id);
        }
      } catch (err) {
        setError("Failed to load coins");
        console.error("Error fetching coins:", err);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      fetchData();
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [selectedCoin, selectedChain]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/wallets/chart-data`, {
        params: {
          coin_id: selectedCoin,
          chain: selectedChain !== "all" ? selectedChain : undefined,
        },
      });
      setData(response.data);
      setError(null);
      setHiddenWallets(new Set());
    } catch (err) {
      setError("Failed to load wallet data");
      console.error("Error fetching wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf);
    // We won't manually set the dataZoom here; we rely on user interaction and a default view.
    // The timeframe now primarily changes how we format the dates and potentially the initial zoom.
    if (chartInstance.current) {
      // Adjust dataZoom based on timeframe
      const endTime = new Date().getTime();
      const startTime = endTime - TIME_FRAMES[tf];
      chartInstance.current.dispatchAction({
        type: "dataZoom",
        startValue: startTime,
        endValue: endTime,
      });
    }
  };

  useEffect(() => {
    if (!chartRef.current || loading || !data || Object.keys(data).length === 0)
      return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const allWallets = Object.entries(data).flatMap(([chain, wallets]) =>
      wallets.map((wallet) => ({ ...wallet, chain }))
    );

    if (allWallets.length === 0) {
      setError("No data available");
      return;
    }

    const filteredWallets = allWallets.filter(
      (wallet) =>
        (selectedChain === "all" ||
          wallet.chain.toLowerCase() === selectedChain.toLowerCase()) &&
        (selectedExchangeFilter === "all" ||
          (selectedExchangeFilter === "exchange"
            ? wallet.is_exchange
            : !wallet.is_exchange))
    );

    const endTime = new Date().getTime();
    const startTime = endTime - TIME_FRAMES[timeframe];

    const series = filteredWallets
      .filter((wallet) => !hiddenWallets.has(wallet.label))
      .map((wallet) => {
        const timeSeriesData = wallet.balances
          .filter((balance) => balance.balance > 0)
          .map((balance) => [
            new Date(balance.recorded_at).getTime(),
            balance.balance,
          ])
          .sort((a, b) => a[0] - b[0]);

        return {
          name: wallet.label,
          type: "line",
          smooth: true,
          symbol: "none",
          data: timeSeriesData,
          lineStyle: {
            width: 2,
            // Differentiate exchange vs. non-exchange with color
            color: wallet.is_exchange ? "#f97316" : "#4f46e5",
          },
          emphasis: {
            focus: "series",
          },
        };
      });

    const options = {
      backgroundColor: "#111",
      animation: false,
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,0.8)",
        borderColor: "#333",
        borderWidth: 1,
        textStyle: {
          color: "#eee",
          fontSize: 13,
        },
        formatter: function (params) {
          if (!params || !params.length) return "";
          const date = format(
            new Date(params[0].value[0]),
            timeframe === "1h" || timeframe === "4h"
              ? "MMM d HH:mm"
              : "MMM d, yyyy HH:mm"
          );
          let result = `<div class="font-medium">${date}</div>`;
          params.forEach((param) => {
            const value = param.value[1];
            result += `<div class="text-sm">${param.marker}${
              param.seriesName
            }: ${value.toLocaleString()}</div>`;
          });
          return result;
        },
      },
      legend: {
        type: "scroll",
        top: 0,
        height: 50,
        textStyle: { fontSize: 12, color: "#ccc" },
        itemGap: 10,
        padding: [10, 10, 10, 10],
      },
      grid: {
        left: "10%",
        right: "10%",
        top: 80,
        bottom: 70,
        containLabel: true,
      },
      xAxis: {
        type: "time",
        axisLine: { lineStyle: { color: "#333" } },
        axisLabel: {
          color: "#aaa",
          formatter: (value) =>
            format(
              new Date(value),
              timeframe === "1h" || timeframe === "4h"
                ? "HH:mm"
                : timeframe === "1d"
                ? "MMM d HH:mm"
                : timeframe === "1w"
                ? "MMM d"
                : "MMM yyyy"
            ),
        },
        splitLine: {
          show: true,
          lineStyle: { color: "#333", type: "dotted" },
        },
      },
      yAxis: {
        type: "log",
        min: yAxisMin || null,
        max: yAxisMax || null,
        axisLine: { lineStyle: { color: "#333" } },
        axisLabel: {
          color: "#aaa",
          formatter: (value) => {
            if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
            if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
            return value.toLocaleString();
          },
        },
        splitLine: {
          lineStyle: { color: "#333", type: "dashed" },
        },
      },
      dataZoom: [
        {
          type: "inside",
          minValueSpan: 3600 * 1000,
        },
        {
          type: "slider",
          show: true,
          bottom: 10,
          height: 20,
          borderColor: "#333",
          backgroundColor: "#222",
          fillerColor: "rgba(255, 255, 255, 0.2)",
          handleStyle: {
            color: "#fff",
            borderColor: "#ACB8C1",
          },
          moveHandleSize: 6,
          rangeMode: ["value", "value"],
        },
      ],
      series,
    };

    chartInstance.current.setOption(options, true);

    // Apply initial timeframe zoom
    chartInstance.current.dispatchAction({
      type: "dataZoom",
      startValue: startTime,
      endValue: endTime,
    });

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    data,
    loading,
    hiddenWallets,
    yAxisMin,
    yAxisMax,
    selectedChain,
    selectedExchangeFilter,
    timeframe,
  ]);

  const handleYAxisSubmit = (e) => {
    e.preventDefault();
    if (chartInstance.current) {
      chartInstance.current.setOption({
        yAxis: {
          min: yAxisMin || null,
          max: yAxisMax || null,
        },
      });
    }
  };

  return (
    <div className="bg-[#111] text-white rounded-lg shadow-sm p-6 min-h-[24rem]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-100">
            Wallet Balances
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedCoin || ""}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="rounded-md border-[#333] bg-[#222] text-gray-200 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.symbol.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="rounded-md border-[#333] bg-[#222] text-gray-200 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ALL</option>
            {Object.keys(data).map((chain) => (
              <option key={chain} value={chain}>
                {chain.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={selectedExchangeFilter}
            onChange={(e) => setSelectedExchangeFilter(e.target.value)}
            className="rounded-md border-[#333] bg-[#222] text-gray-200 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Wallets</option>
            <option value="exchange">Exchange Only</option>
            <option value="non-exchange">Non-Exchange Only</option>
          </select>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2 mb-4">
        {["1h", "4h", "1d", "1w", "1m"].map((tf) => (
          <button
            key={tf}
            onClick={() => handleTimeframeChange(tf)}
            className={`px-3 py-1 text-sm font-medium rounded ${
              timeframe === tf
                ? "bg-blue-600 text-white"
                : "bg-[#222] text-gray-200 hover:bg-[#333]"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      <form onSubmit={handleYAxisSubmit} className="flex items-end gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Min Balance
          </label>
          <input
            type="number"
            value={yAxisMin}
            onChange={(e) =>
              setYAxisMin(e.target.value ? Number(e.target.value) : "")
            }
            className="w-32 px-3 py-1 border border-[#333] bg-[#222] text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Max Balance
          </label>
          <input
            type="number"
            value={yAxisMax}
            onChange={(e) =>
              setYAxisMax(e.target.value ? Number(e.target.value) : "")
            }
            className="w-32 px-3 py-1 border border-[#333] bg-[#222] text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply
        </button>
      </form>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="relative bg-[#222] border border-[#333] rounded-md">
        <div ref={chartRef} className="h-[400px] w-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111] bg-opacity-75">
            <Loader className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        )}
      </div>

      {/* Wallet Balance Table below */}
      <div className="mt-6 bg-[#222] border border-[#333] rounded-lg p-4">
        <WalletBalanceTable
          selectedCoin={selectedCoin}
          selectedChain={selectedChain}
        />
      </div>
    </div>
  );
};

export default WalletBalanceChart;
