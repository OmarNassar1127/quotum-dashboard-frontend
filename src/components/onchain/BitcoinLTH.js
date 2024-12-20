import React, { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { format } from "date-fns";
import axios from "../../lib/axios";
import { Loader, AlertCircle, Info } from "lucide-react";
import FeatureRestricted from "../restricted/FeatureRestricted";

const BitcoinLTH = () => {
  const [chartData, setChartData] = useState({
    dates: [],
    lthSupply: [],
    prices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pricesResponse, lthResponse] = await Promise.all([
        axios.get("/platform/bitcoin/daily"),
        axios.get("/platform/bitcoin/lth-supply"),
      ]);

      const lthData = lthResponse.data?.response?.chart?.figure?.data?.[0];

      if (!lthData) {
        throw new Error("Invalid LTH supply data format");
      }

      setChartData({
        dates: lthData.x,
        lthSupply: lthData.y,
        prices: lthData.customdata.map((item) => item[0]),
        fillColor: lthData.fillcolor,
        lineColor: lthData.line.color,
        lineWidth: lthData.line.width,
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
        return `<div class="font-medium">${date}</div>
                <div class="text-sm mt-1">LTH Supply: <span class="text-orange-400">${params[1].value.toLocaleString()} BTC</span></div>
                <div class="text-sm">Price: <span class="text-blue-400">$${params[0].value.toLocaleString()}</span></div>`;
      },
    },
    grid: {
      top: "5%", // Adjust if needed, but "5%" should suffice if nameGap is enough
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
        name: "Price",
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
        name: "LTH Supply",
        nameGap: -30,
        position: "right",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: (value) => `${(value / 1e6).toFixed(1)}M`,
          color: "#aaa",
          fontSize: 11,
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "LTH Supply",
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
    ],
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        zoomLock: false, 
        throttle: 100
      },
      {
        show: true,
        type: "slider",
        top: "90%",
        start: 0,
        end: 100,
        height: 20,
        borderColor: '#333',
        backgroundColor: '#222',
        fillerColor: 'rgba(80,80,80,0.2)',
        textStyle: {
          color: '#aaa',
          fontSize: 11
        },
        
        showDetail: false,
        moveHandleSize: 7,
        zoomOnMouseWheel: true
      }
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Bitcoin: Short Term Holder Supply
        </h2>

        <FeatureRestricted feature="btc_lth">
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
            <p className="text-sm text-gray-400">
              This chart shows the total supply of Bitcoin held by Long Term
              Holders (LTH), defined as addresses that have held Bitcoin for
              more than 155 days. The orange line represents the LTH supply
              while the blue line shows the Bitcoin price.
            </p>
            <p className="text-sm text-gray-400">
              Long Term Holder behavior often reflects market conviction and can
              be used to identify more stable accumulation phases, as these
              holders are less likely to sell during short-term price
              fluctuations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinLTH;
