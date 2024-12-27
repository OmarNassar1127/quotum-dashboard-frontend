import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import axios from "../../lib/axios";
import { Info } from "lucide-react";

const DominanceChart = () => {
  const [chartData, setChartData] = useState({
    dates: [],
    ratio: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDominanceData();
  }, []);

  const fetchDominanceData = async () => {
    try {
      const response = await axios.get("/dominance/chart");
      const { data } = response;
      if (data.success) {
        setChartData({
          dates: data.data.map((item) => item.date),
          ratio: data.data.map((item) =>
            Number((item.others_dominance / item.btc_dominance).toFixed(4))
          ),
        });
        setError(null);
      } else {
        throw new Error("Failed to fetch dominance data");
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const options = {
    backgroundColor: "#111",
    textStyle: { color: "#ccc" },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      formatter: (params) => {
        const date = params[0]?.axisValueLabel;
        return `<div>
          <strong>${date}</strong><br/>
          Others/BTC: ${params[0]?.value.toFixed(4)}
        </div>`;
      },
    },
    grid: {
      top: "10%",
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.dates,
      axisLabel: {
        color: "#aaa",
        formatter: (value) => new Date(value).toLocaleDateString(),
      },
      axisLine: { lineStyle: { color: "#444" } },
    },
    yAxis: {
      type: "log",
      axisLabel: {
        color: "#aaa",
        formatter: (value) => value.toFixed(2),
      },
      splitLine: { lineStyle: { color: "#333" } },
      minInterval: 0.1,
      splitNumber: 10,
      logBase: 10,
    },
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 100,
        height: 20,
        textStyle: { color: "#aaa" },
      },
    ],
    series: [
      {
        name: "Others/BTC Ratio",
        type: "line",
        data: chartData.ratio,
        smooth: true,
        lineStyle: { color: "#34D399", width: 2 },
        itemStyle: { color: "#34D399" },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">
          Others/BTC Dominance Ratio
        </h2>
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : (
          <ReactECharts option={options} style={{ height: "400px" }} />
        )}
      </div>

      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium mb-2">
              What is the Others/BTC Dominance Ratio showing?
            </p>
            <p className="text-sm text-gray-400">
              This ratio represents the relative market dominance between all
              other cryptocurrencies combined versus Bitcoin.
            </p>
            <p className="text-sm text-gray-400">
              When the ratio increases, it indicates altcoins are gaining market
              share relative to Bitcoin. Conversely, a decreasing ratio shows
              Bitcoin strengthening its market position against other
              cryptocurrencies.
            </p>
            <p className="text-sm text-gray-400">
              Historical patterns show this ratio tends to increase during
              altcoin seasons and decrease during Bitcoin dominance periods,
              making it a useful metric for understanding market cycles and
              sentiment shifts in the crypto market.
            </p>
            <p className="text-sm text-gray-400">
              The logarithmic scale helps visualize these changes over long time
              periods, as the ratio can vary significantly between bull and bear
              market cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DominanceChart;
