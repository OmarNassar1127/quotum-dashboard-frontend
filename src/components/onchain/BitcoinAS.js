import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { format } from "date-fns";
import axios from "../../lib/axios";
import { Loader, AlertCircle, Info, Eye, EyeOff } from "lucide-react";
import FeatureRestricted from "../restricted/FeatureRestricted";

const BitcoinAS = () => {
  const [chartData, setChartData] = useState({
    dates: [],
    lthSupply: [],
    prices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrice, setShowPrice] = useState(true);
  const [showAddresses, setShowAddresses] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pricesResponse, lthResponse] = await Promise.all([
        axios.get("/platform/bitcoin/daily"),
        axios.get("/platform/bitcoin/active-addresses"),
      ]);

      const lthData = lthResponse.data?.response?.chart?.figure?.data?.[0];

      if (!lthData) {
        throw new Error("Invalid data format");
      }

      setChartData({
        dates: lthData.x,
        lthSupply: lthData.y,
        prices: lthData.customdata.map((item) => item[0]),
      });

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
        type: "cross",
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
        const date = format(new Date(params[0].axisValue), "MMM d, yyyy");
        const addressesValue = params.find(
          (p) => p.seriesName === "Active Addresses"
        )?.value;
        const priceValue = params.find((p) => p.seriesName === "Price")?.value;

        let tooltipContent = `<div class="font-medium">${date}</div>`;

        if (showPrice && priceValue) {
          tooltipContent += `<div class="text-sm mt-1">Active Addresses: <span class="text-orange-400">${priceValue.toLocaleString()}</span></div>`;
        }

        if (showAddresses && addressesValue) {
          tooltipContent += `<div class="text-sm">Price: <span class="text-blue-400">$${addressesValue.toLocaleString()}</span></div>`;
        }

        return tooltipContent;
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
      type: "category",
      data: chartData.dates,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        formatter: (value) => format(new Date(value), "MMM yyyy"),
        color: "#aaa",
        fontSize: 11,
        margin: 15,
      },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: "log",
        name: "",
        nameGap: -30,
        position: "left",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: (value) => `$${value.toLocaleString()}`,
          color: "#aaa",
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: "#333",
            type: "dashed",
          },
        },
      },
      {
        type: "value",
        name: "",
        nameGap: -30,
        position: "right",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#aaa",
          fontSize: 11,
        },
        splitLine: { show: false },
      },
    ],
    series: [
      ...(showAddresses
        ? [
            {
              name: "Active Addresses",
              type: "line",
              smooth: true,
              data: chartData.lthSupply,
              lineStyle: {
                color: "#3b82f6",
                width: 2,
              },
              itemStyle: {
                color: "#3b82f6",
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
                      color: "rgba(255, 153, 0, 0.2)",
                    },
                    {
                      offset: 1,
                      color: "rgba(255, 153, 0, 0.02)",
                    },
                  ],
                },
              },
            },
          ]
        : []),
      ...(showPrice
        ? [
            {
              name: "Price",
              type: "line",
              yAxisIndex: 1,
              smooth: true,
              data: chartData.prices,
              lineStyle: {
                color: "#FF9900",
                width: 2,
              },
              itemStyle: {
                color: "#FF9900",
              },
            },
          ]
        : []),
    ],
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        zoomLock: false,
        throttle: 100,
      },
      {
        show: true,
        type: "slider",
        top: "90%",
        start: 0,
        end: 100,
        height: 20,
        borderColor: "#333",
        backgroundColor: "#222",
        fillerColor: "rgba(80,80,80,0.2)",
        textStyle: {
          color: "#aaa",
          fontSize: 11,
        },
        showDetail: false,
        moveHandleSize: 7,
        zoomOnMouseWheel: true,
      },
    ],
  };

  const ToggleButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
        active
          ? "bg-white/10 text-white"
          : "bg-transparent text-gray-400 hover:bg-white/5"
      }`}
    >
      {active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-100">
            Bitcoin: Active Addresses
          </h2>
          <div className="flex gap-2">
            <ToggleButton
              active={showAddresses}
              onClick={() => setShowAddresses(!showAddresses)}
            >
              Price
            </ToggleButton>
            <ToggleButton
              active={showPrice}
              onClick={() => setShowPrice(!showPrice)}
            >
              Active Addresses
            </ToggleButton>
          </div>
        </div>

        <FeatureRestricted feature="btc_active_addresses">
          {error ? (
            <div className="flex items-center text-red-300 bg-red-500/10 border border-red-500 rounded-lg p-4 mt-10">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-[360px]">
              <Loader className="h-8 w-8 animate-spin text-gray-300" />
            </div>
          ) : (
            <ReactECharts
              ref={chartRef}
              option={options}
              style={{ height: "360px" }}
              opts={{ renderer: "canvas" }}
              notMerge={true}
              lazyUpdate={true}
            />
          )}
        </FeatureRestricted>
      </div>

      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium mb-2">
              What is this Bitcoin chart Showing?
            </p>
            <p className="text-sm text-gray-400">
              The number of addresses on the Bitcoin blockchain that either sent
              or received transactions.
            </p>
            <p className="text-sm text-gray-400">
              This is a useful metric to monitor over time as it shows the
              amount of activity happening on the Bitcoin network. As Bitcoin
              becomes more and more adopted over time, the number of active
              addresses increases.
            </p>
            <p className="text-sm text-gray-400">
              However, you can also see zooming in that during periods where the
              price drops, so too can active addresses as speculators hoping
              that $BTC price will go up, become less interested in bitcoin in
              the near term. That drop-off in speculation and general usage
              results in drops in the number of active addresses.
            </p>
            <p className="text-sm text-gray-400">
              The bitcoin chart above uses a 7 day moving average for the number
              of bitcoin active addresses to smooth out the daily fluctuations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinAS;
