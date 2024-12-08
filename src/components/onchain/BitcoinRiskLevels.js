import React, { useState, useEffect, useRef } from "react";
import axios from "../../lib/axios";
import * as echarts from "echarts";
import { Loader, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";
import FeatureRestricted from "../restricted/FeatureRestricted";

const BitcoinRiskLevels = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyPrices, setDailyPrices] = useState([]);

  useEffect(() => {
    fetchDailyPrices();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || dailyPrices.length === 0) return;
    renderChart();

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dailyPrices, loading]);

  const fetchDailyPrices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/platform/bitcoin/daily");
      const processed = response.data.map((d) => ({
        time: d.time * 1000,
        value: parseFloat(d.value),
      }));
      setDailyPrices(processed);
      setError(null);
    } catch (err) {
      console.error("Error fetching daily prices:", err);
      setError("Failed to load daily prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Fixed risk levels from 0.500 to 0.800
    const riskLevels = [
      { risk: 0.5, price: 72879 },
      { risk: 0.525, price: 77819 },
      { risk: 0.55, price: 82980 },
      { risk: 0.575, price: 88361 },
      { risk: 0.6, price: 93959 },
      { risk: 0.625, price: 99776 },
      { risk: 0.65, price: 105810 },
      { risk: 0.675, price: 112061 },
      { risk: 0.7, price: 118528 },
      { risk: 0.725, price: 125209 },
      { risk: 0.75, price: 132105 },
      { risk: 0.775, price: 139215 },
      { risk: 0.8, price: 146538 },
    ];

    // Set fixed 6-month window
    const now = new Date().getTime();
    const threeMonths = 90 * 24 * 60 * 60 * 1000;
    const startTime = now - threeMonths;
    const endTime = now + threeMonths;

    const prices = dailyPrices
      .map((d) => [d.time, d.value])
      .sort((a, b) => a[0] - b[0]);

    // markLine data for each risk line
    const markLineData = riskLevels.map((line) => ({
      yAxis: line.price,
      name: `${line.risk.toFixed(3)}: $${line.price.toLocaleString()}`,
      lineStyle: {
        color: "white",
        width: 1,
        type: "solid",
      },
      label: {
        show: true,
        position: "end",
        color: "#eee",
        fontSize: 11,
        formatter: (param) => param.name,
      },
    }));

    const series = [
      {
        name: "BTC Price",
        type: "line",
        data: prices,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: "#4f46e5",
        },
        markLine: {
          symbol: "none",
          data: markLineData,
        },
        emphasis: {
          focus: "series",
        },
      },
    ];

    // Y-axis from 70k to 150k
    const fixedMin = 70000;
    const fixedMax = 150000;

    const options = {
      backgroundColor: "#111",
      textStyle: {
        color: "#ccc",
      },
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
          const date = format(new Date(params[0].value[0]), "MMM d, yyyy");
          let result = `<div class="font-medium mb-1">${date}</div>`;
          params.forEach((param) => {
            const val = param.value[1];
            result += `<div class="text-sm">${param.marker}${
              param.seriesName
            }: $${val.toLocaleString()}</div>`;
          });
          return result;
        },
      },
      legend: {
        show: false,
      },
      grid: {
        left: "10%",
        right: "10%",
        top: 60,
        bottom: 60,
      },
      xAxis: {
        type: "time",
        min: startTime,
        max: endTime,
        axisLine: { lineStyle: { color: "#333" } },
        axisLabel: {
          color: "#aaa",
          formatter: (value) => format(new Date(value), "MMM d"),
        },
        splitLine: {
          lineStyle: { color: "#333", type: "dotted" },
        },
      },
      yAxis: {
        type: "value",
        min: fixedMin,
        max: fixedMax,
        interval: 10000,
        axisLine: { lineStyle: { color: "#333" } },
        axisLabel: {
          color: "#aaa",
          formatter: (val) => {
            if (val >= 1000) return (val / 1000).toFixed(0) + "K";
            return val.toLocaleString();
          },
        },
        splitLine: {
          lineStyle: { color: "#333", type: "dashed" },
        },
        name: "Price ($)",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: {
          color: "#aaa",
          fontSize: 12,
        },
      },
      series: series,
    };

    chartInstance.current.setOption(options, true);
    chartInstance.current.resize();
  };

  return (
    <div className="p-6 bg-[#111] text-white min-h-screen border border-[#222]">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">
        Bitcoin Risk Levels
      </h1>
      <div className="text-sm text-gray-400 mb-6">
        Latest Risk Value: 0.626, Confidence Level: 9
      </div>

      <FeatureRestricted feature="btc_risk_levels">
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
          <div ref={chartRef} className="h-[600px] w-full" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111] bg-opacity-75">
              <Loader className="h-8 w-8 animate-spin text-gray-300" />
            </div>
          )}
        </div>

        <div className="mt-6 space-y-6 text-gray-300">
          <div className="bg-[#222] rounded-lg p-6 border border-[#333]">
            <h2 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
              <Info className="h-5 w-5" />
              About This Chart
            </h2>

            <div className="space-y-4 text-sm">
              <p>
                This chart displays Bitcoin price overlaid with risk levels from
                0.500 ($72,879) to 0.800 ($146,538) in 0.025 increments. The
                y-axis spans from 70K to 150K with 10K increments, showing a
                6-month window centered on today.
              </p>

              <div>
                <h3 className="font-medium text-gray-100 mb-2">Description</h3>
                <p>
                  This visualization maps risk levels from the risk tables onto
                  the price chart. The "zoomed in" view shows risk levels around
                  the current price in 0.025 steps, while the "zoomed out" view
                  presents the full 0-1 risk range in 0.1 increments. Note that
                  risk levels are dynamic – today's 0 risk level will differ in
                  the future. Moving averages can be approximated by multiplying
                  their length with 7 (e.g., 200W SMA ≈ 1400D SMA).
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-100 mb-2">Usage Guide</h3>
                <p>
                  Capitulation events can occur rapidly within a day,
                  potentially driving prices significantly below closing values.
                  Setting strategic limit orders can help capitalize on these
                  events. Risk levels serve as effective price targets for
                  dynamic limit orders – "dynamic" meaning you may want to
                  increase investment as prices approach lower risk levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FeatureRestricted>
    </div>
  );
};

export default BitcoinRiskLevels;
