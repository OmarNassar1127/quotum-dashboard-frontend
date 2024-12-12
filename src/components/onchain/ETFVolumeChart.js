import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { format } from "date-fns";
import axios from "../../lib/axios";
import { Loader, AlertCircle, Info } from "lucide-react";
import FeatureRestricted from "../restricted/FeatureRestricted";

const ETFVolumeChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalVolume, setTotalVolume] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/platform/bitcoin/etf-volume");
      const data = response.data;
      setChartData(data);

      data.sort((a, b) => a.time - b.time);

      if (data && data.length > 0) {
        const latestDataPoint = data[data.length - 1];
        const latestVolume = latestDataPoint.value;
        setTotalVolume(latestVolume);

        const sevenDaysAgoIndex = data.length - 8;
        if (sevenDaysAgoIndex >= 0) {
          const sevenDaysAgoVolume = data[sevenDaysAgoIndex].value;
          const change =
            ((latestVolume - sevenDaysAgoVolume) / sevenDaysAgoVolume) * 100;
          setPercentageChange(change);
        }
      }

      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    backgroundColor: "#111",
    textStyle: {
      color: "#ccc",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgba(59,130,246,0.2)",
          width: 2,
        },
      },
      backgroundColor: "rgba(0,0,0,0.8)",
      borderColor: "#333",
      borderWidth: 1,
      padding: [10, 15],
      textStyle: {
        color: "#eee",
        fontSize: 13,
      },
      formatter: function (params) {
        const date = format(new Date(params[0].value[0] * 1000), "MMM d, yyyy");
        const value = params[0].value[1] / 1e9; // Convert to billions
        return `<div class="font-medium">${date}</div>
                <div class="text-sm mt-1">Volume: <span class="text-blue-400">$${value.toFixed(
                  2
                )}b</span></div>`;
      },
    },
    grid: {
      top: "5%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: (value) => format(new Date(value), "MMM yyyy"),
        color: "#aaa",
        fontSize: 11,
        margin: 15,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: (value) => `$${(value / 1e9).toFixed(0)}b`,
        color: "#aaa",
        fontSize: 11,
        margin: 15,
      },
      splitLine: {
        lineStyle: {
          color: "#333",
          type: "dashed",
        },
      },
    },
    series: [
      {
        data: chartData?.map((item) => [item.time * 1000, item.value]) || [],
        type: "line",
        smooth: 0.3,
        symbol: "circle",
        symbolSize: 1,
        lineStyle: {
          color: "#3b82f6",
          width: 3,
          shadowColor: "rgba(59, 130, 246, 0.2)",
          shadowBlur: 10,
        },
        itemStyle: {
          color: "#3b82f6",
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(59, 130, 246, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(59, 130, 246, 0.02)",
              },
            ],
          },
        },
      },
    ],
    animation: true,
  };

  return (
    <div className="space-y-6">
      {/* Chart Container */}
      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Cumulative Spot Bitcoin ETF Volume
        </h2>

        <FeatureRestricted feature="btc_etf">
          {!loading && totalVolume !== null && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-12 space-y-4 sm:space-y-0 mb-6">
              <div className="flex flex-col">
                <div className="text-base font-bold text-gray-400">
                  Total Volume
                </div>
                <div className="text-3xl font-bold text-gray-100">
                  $
                  {(totalVolume / 1e9).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  b
                </div>
              </div>

              {percentageChange !== null && (
                <div className="flex flex-col">
                  <div className="text-base font-bold text-gray-400">
                    7-Day Change
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      percentageChange >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {percentageChange >= 0 ? "+" : ""}
                    {percentageChange.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          )}

          {error ? (
            <div className="flex items-center text-red-300 bg-red-500/10 border border-red-500 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-[360px]">
              <Loader className="h-8 w-8 animate-spin text-gray-300" />
            </div>
          ) : (
            <ReactECharts option={options} style={{ height: "360px" }} />
          )}
        </FeatureRestricted>
      </div>

      {/* Description Container */}
      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              This chart shows the cumulative trading volume for all spot
              Bitcoin ETFs, including BlackRock (IBIT), Grayscale (GBTC),
              Fidelity (FBTC), Ark/21Shares (ARKB), and others. The data is
              aggregated daily and represents the total USD volume traded since
              the ETFs' launch in January 2024.
            </p>
            <p className="text-sm text-gray-400">
              Data is sourced from Yahoo Finance and updated daily. The
              cumulative volume provides a clear picture of the growing market
              participation and adoption of Bitcoin ETFs in traditional
              financial markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETFVolumeChart;
