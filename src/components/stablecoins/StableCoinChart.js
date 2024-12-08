import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { format } from "date-fns";
import axios from "../../lib/axios";
import { Loader, AlertCircle } from "lucide-react";

const StableCoinChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalMarketCap, setTotalMarketCap] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/platform/stablecoins");
      const data = response.data;
      setChartData(data);

      data.sort((a, b) => new Date(a.month) - new Date(b.month));

      if (data && data.length > 0) {
        const latestDataPoint = data[data.length - 1];
        const latestMarketCap = latestDataPoint.price;
        setTotalMarketCap(latestMarketCap);

        const latestDate = new Date(latestDataPoint.month);
        const sevenDaysAgoDate = new Date(latestDate);
        sevenDaysAgoDate.setDate(latestDate.getDate() - 7);

        let sevenDaysAgoDataPoint = null;
        for (let i = data.length - 1; i >= 0; i--) {
          const dataPointDate = new Date(data[i].month);
          if (dataPointDate <= sevenDaysAgoDate) {
            sevenDaysAgoDataPoint = data[i];
            break;
          }
        }

        if (sevenDaysAgoDataPoint) {
          const oldMarketCap = sevenDaysAgoDataPoint.price;
          const change =
            ((latestMarketCap - oldMarketCap) / oldMarketCap) * 100;
          setPercentageChange(change);
        } else {
          setPercentageChange(null);
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
        const date = format(new Date(params[0].value[0]), "MMM d, yyyy");
        const value = params[0].value[1];
        return `<div class="font-medium">${date}</div>
                <div class="text-sm mt-1">Mcap: <span class="text-blue-400">$${value.toFixed(
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
        formatter: (value) => `$${value.toFixed(0)}b`,
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
        data:
          chartData?.map((item) => [new Date(item.month), item.price]) || [],
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
    <div className="bg-[#111] border border-[#222] rounded-xl shadow-sm p-6 min-h-[24rem] text-white">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Total Stablecoin Market Cap
      </h2>

      {!loading && totalMarketCap !== null && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-12 space-y-4 sm:space-y-0 mb-6">
          <div className="flex flex-col">
            <div className="text-base font-bold text-gray-400">Market Cap</div>
            <div className="text-3xl font-bold text-gray-100">
              $
              {totalMarketCap.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              b
            </div>
          </div>

          {percentageChange !== null && (
            <div className="flex flex-col">
              <div className="text-base font-bold text-gray-400">
                (Past 7 days)
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
    </div>
  );
};

export default StableCoinChart;
