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
    if (chartInstance.current) {
      const endTime = new Date().getTime();
      const startTime = endTime - TIME_FRAMES[tf];

      chartInstance.current.setOption({
        dataZoom: [
          {
            type: "inside",
            startValue: startTime,
            endValue: endTime,
            minValueSpan: 3600 * 1000,
          },
          {
            type: "slider",
            startValue: startTime,
            endValue: endTime,
            show: true,
            bottom: 10,
            height: 40,
            borderColor: "transparent",
            backgroundColor: "#f1f5f9",
            fillerColor: "rgba(167, 182, 194, 0.3)",
            handleIcon:
              "path://M-9.35,27.3L-3.65,27.3L-3.65,-27.3L-9.35,-27.3L-9.35,27.3Z M3.65,-27.3L3.65,27.3L9.35,27.3L9.35,-27.3L3.65,-27.3Z",
            handleSize: "120%",
            handleStyle: {
              color: "#fff",
              borderColor: "#ACB8C1",
            },
            moveHandleSize: 6,
            rangeMode: ["value", "value"],
          },
        ],
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

    let minValue = Infinity;
    let maxValue = -Infinity;
    filteredWallets.forEach((wallet) => {
      if (!hiddenWallets.has(wallet.label)) {
        wallet.balances.forEach((balance) => {
          if (balance.balance > 0) {
            minValue = Math.min(minValue, balance.balance);
            maxValue = Math.max(maxValue, balance.balance);
          }
        });
      }
    });

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
            color: wallet.is_exchange ? "#f97316" : "#4f46e5",
          },
          emphasis: {
            focus: "series",
          },
        };
      });

    const options = {
      animation: false,
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const date = format(
            new Date(params[0].value[0]),
            timeframe === "1h" ? "HH:mm:ss" : "MMM d, yyyy HH:mm"
          );
          let result = `${date}<br/>`;
          params.forEach((param) => {
            const value = param.value[1];
            result += `${param.seriesName}: ${value.toLocaleString()}<br/>`;
          });
          return result;
        },
      },
      legend: {
        type: "plain",
        top: 0,
        height: 50,
        data: filteredWallets
          .filter((wallet) => !hiddenWallets.has(wallet.label))
          .map((wallet) => ({
            name: wallet.label,
            itemStyle: {
              color: wallet.is_exchange ? "#f97316" : "#4f46e5",
            },
          })),
        textStyle: { fontSize: 12 },
        itemGap: 10,
        padding: [0, 0, 20, 0],
      },
      grid: {
        left: "10%",
        right: "5%",
        top: "100px",
        bottom: "70px",
        containLabel: true,
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: (value) =>
            format(
              new Date(value),
              timeframe === "1h"
                ? "HH:mm"
                : timeframe === "4h"
                ? "HH:mm"
                : timeframe === "1d"
                ? "MMM d HH:mm"
                : "MMM d"
            ),
        },
      },
      yAxis: {
        type: "log",
        min: yAxisMin || undefined,
        max: yAxisMax || undefined,
        axisLabel: {
          formatter: (value) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
            if (value >= 1000) return (value / 1000).toFixed(1) + "K";
            return value.toLocaleString();
          },
        },
      },
      dataZoom: [
        {
          type: "inside",
          startValue: startTime,
          endValue: endTime,
          minValueSpan: 3600 * 1000,
        },
        {
          type: "slider",
          startValue: startTime,
          endValue: endTime,
          show: true,
          bottom: 10,
          height: 40,
          borderColor: "transparent",
          backgroundColor: "#f1f5f9",
          fillerColor: "rgba(167, 182, 194, 0.3)",
          handleIcon:
            "path://M-9.35,27.3L-3.65,27.3L-3.65,-27.3L-9.35,-27.3L-9.35,27.3Z M3.65,-27.3L3.65,27.3L9.35,27.3L9.35,-27.3L3.65,-27.3Z",
          handleSize: "120%",
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
          min: yAxisMin || undefined,
          max: yAxisMax || undefined,
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[24rem]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Wallet Balances
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedCoin || ""}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Wallets</option>
            <option value="exchange">Exchange Only</option>
            <option value="non-exchange">Non-Exchange Only</option>
          </select>

          <div className="flex rounded-md shadow-sm">
            {Object.keys(TIME_FRAMES).map((tf) => (
              <button
                key={tf}
                onClick={() => handleTimeframeChange(tf)}
                className={`px-4 py-2 text-sm font-medium ${
                  timeframe === tf
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border ${
                  timeframe === tf ? "border-indigo-600" : "border-gray-300"
                } first:rounded-l-md last:rounded-r-md -ml-px first:ml-0`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleYAxisSubmit} className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Min Balance
          </label>
          <input
            type="number"
            value={yAxisMin}
            onChange={(e) =>
              setYAxisMin(e.target.value ? Number(e.target.value) : "")
            }
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Min value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Balance
          </label>
          <input
            type="number"
            value={yAxisMax}
            onChange={(e) =>
              setYAxisMax(e.target.value ? Number(e.target.value) : "")
            }
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Max value"
          />
        </div>
        <button
          type="submit"
          className="mt-auto mb-[1px] px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Range
        </button>
      </form>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex itemsflex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="relative">
        <div ref={chartRef} className="h-[400px] w-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
      </div>

      <WalletBalanceTable
        selectedCoin={selectedCoin}
        selectedChain={selectedChain}
        selectedExchangeFilter={selectedExchangeFilter}
      />
    </div>
  );
};

export default WalletBalanceChart;
