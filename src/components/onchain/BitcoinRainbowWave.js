import React, { useState, useEffect, useRef } from "react";
import axios from "../../lib/axios";
import * as echarts from "echarts";
import { Loader, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";
import FeatureRestricted from "../restricted/FeatureRestricted";

const BitcoinRainbowWave = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    fetchPriceData();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading || priceData.length === 0) return;
    renderChart();

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [priceData, loading]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/platform/bitcoin/daily");
      const processed = response.data.map((d) => ({
        time: d.time * 1000,
        value: parseFloat(d.value),
      }));
      setPriceData(processed);
      setError(null);
    } catch (err) {
      console.error("Error fetching price data:", err);
      setError("Failed to load price data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateHalvingTime = (timestamp) => {
    const H000 = new Date("2009-01-03T18:15:05Z").getTime();
    const H100 = new Date("2012-11-28T16:24:38Z").getTime();
    const H200 = new Date("2016-07-09T18:46:13Z").getTime();
    const H300 = new Date("2020-05-11T21:23:43Z").getTime();
    const H400 = new Date("2024-04-20T02:09:27Z").getTime();

    let h;
    if (timestamp >= H400) {
      h = 4 + (timestamp - H400) / (210000 * 600 * 1000);
    } else if (timestamp >= H300) {
      h = 3 + (timestamp - H300) / (210000 * 600 * 1000);
    } else if (timestamp >= H200) {
      h = 2 + (timestamp - H200) / (210000 * 600 * 1000);
    } else if (timestamp >= H100) {
      h = 1 + (timestamp - H100) / (210000 * 600 * 1000);
    } else {
      h = (timestamp - H000) / (210000 * 600 * 1000);
    }
    return h;
  };

  const calculateWavePrice = (h) => {
    const a = 1.48;
    const b = 5.44;
    const basePrice = Math.pow(10, a + b * Math.log10(h));

    const decay = Math.pow(0.8, h + 0.9);
    const delay =
      h < 3.275
        ? ((1.12 + Math.cos(2.5 * h + 0.44)) *
            (0.23 + 7 * Math.exp(-1.333 * h))) /
          (2 * Math.PI)
        : 0.025;

    const sin = Math.sin(2 * Math.PI * (h - delay));

    const bands = {
      base: basePrice,
      up2: basePrice * Math.pow(10, decay * (sin + 0.6666)),
      up1: basePrice * Math.pow(10, decay * (sin + 0.3333)),
      mid: basePrice * Math.pow(10, decay * sin),
      down1: basePrice * Math.pow(10, decay * (sin - 0.3333)),
      down2: Math.max(
        basePrice * Math.pow(10, decay * (sin - 0.6666)),
        basePrice * Math.pow(10, -1)
      ),
    };

    return bands;
  };

  const renderChart = () => {
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const colors = {
      price: "#ffffff",
      upperBand2: "#FF0000",
      upperBand1: "#FF7F00",
      middle: "#FFFF00",
      lowerBand1: "#00FF00",
      lowerBand2: "#00FFFF",
    };

    const now = Date.now();
    const futureEnd = new Date("2026-12-31").getTime();
    const waveBands = [];

    for (let t = priceData[0].time; t <= futureEnd; t += 24 * 60 * 60 * 1000) {
      const h = calculateHalvingTime(t);
      const bands = calculateWavePrice(h);
      waveBands.push({
        time: t,
        ...bands,
      });
    }

    const series = [
      {
        name: "Bitcoin Price",
        type: "line",
        data: priceData.map((d) => [d.time, d.value]),
        symbol: "none",
        lineStyle: { width: 2, color: colors.price },
      },
      {
        name: "Upper Band 2",
        type: "line",
        data: waveBands.map((b) => [b.time, b.up2]),
        smooth: true,
        symbol: "none",
        lineStyle: { width: 1, color: colors.upperBand2 },
      },
      {
        name: "Upper Band 1",
        type: "line",
        data: waveBands.map((b) => [b.time, b.up1]),
        smooth: true,
        symbol: "none",
        lineStyle: { width: 1, color: colors.upperBand1 },
      },
      {
        name: "Middle Band",
        type: "line",
        data: waveBands.map((b) => [b.time, b.mid]),
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, color: colors.middle },
      },
      {
        name: "Lower Band 1",
        type: "line",
        data: waveBands.map((b) => [b.time, b.down1]),
        smooth: true,
        symbol: "none",
        lineStyle: { width: 1, color: colors.lowerBand1 },
      },
      {
        name: "Lower Band 2",
        type: "line",
        data: waveBands.map((b) => [b.time, b.down2]),
        smooth: true,
        symbol: "none",
        lineStyle: { width: 1, color: colors.lowerBand2 },
      },
    ];

    const options = {
      backgroundColor: "#111",
      textStyle: { color: "#ccc" },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(0,0,0,0.8)",
        borderColor: "#333",
        borderWidth: 1,
        textStyle: { color: "#eee", fontSize: 13 },
        formatter: (params) => {
          if (!params || !params.length || !params[0].value) return "";

          const date = format(new Date(params[0].value[0]), "MMM d, yyyy");
          let result = `<div class="font-medium mb-1">${date}</div>`;

          params.forEach((param) => {
            if (param && param.value && typeof param.value[1] === "number") {
              result += `<div class="text-sm">${param.marker}${
                param.seriesName
              }: $${param.value[1].toLocaleString()}</div>`;
            }
          });

          return result;
        },
      },
      legend: {
        data: series.map((s) => s.name),
        textStyle: { color: "#ccc" },
        top: 25,
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
          xAxisIndex: [0],
        },
        {
          type: "slider",
          start: 0,
          end: 100,
          xAxisIndex: [0],
          bottom: 25,
          borderColor: "#333",
          textStyle: { color: "#ccc" },
          backgroundColor: "#222",
          fillerColor: "rgba(80,80,80,0.3)",
          handleStyle: {
            color: "#666",
          },
        },
      ],
      grid: {
        left: "10%",
        right: "10%",
        top: 80,
        bottom: 100,
      },
      xAxis: {
        type: "time",
        axisLine: { lineStyle: { color: "#333" } },
        axisLabel: {
          color: "#aaa",
          formatter: (value) => format(new Date(value), "MMM yyyy"),
        },
        splitLine: {
          lineStyle: { color: "#333", type: "dotted" },
        },
      },
      yAxis: {
        type: "log",
        axisLine: { lineStyle: { color: "#333" } },
        axisLabel: {
          color: "#aaa",
          formatter: (val) => {
            if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
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
      series,
    };

    chartInstance.current.setOption(options, true);
    chartInstance.current.resize();
  };

  return (
    <div className="p-6 bg-[#111] text-white min-h-screen border border-[#222]">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">
        Bitcoin Rainbow Wave Model
      </h1>

      <FeatureRestricted feature="btc_rainbow_wave">
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
              About This Model
            </h2>

            <div className="space-y-4 text-sm">
              <p>
                The Bitcoin Rainbow Wave Model combines price action with
                wave-based analysis that adapts to Bitcoin's halving cycles. The
                model uses both power law dynamics and damped harmonic
                oscillations to predict price movements.
              </p>

              <div>
                <h3 className="font-medium text-gray-100 mb-2">
                  Price Predictions
                </h3>
                <p>
                  The model forecasts a potential market top around July 2025 at
                  ~$220,000, followed by a local bottom in July 2026 at
                  ~$73,000. Beyond that, it projects a cycle top in July 2029 at
                  ~$560,000.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FeatureRestricted>
    </div>
  );
};

export default BitcoinRainbowWave;
