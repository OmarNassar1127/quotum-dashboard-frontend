import React, { useEffect, useRef, useState } from "react";
import { createChart, LineStyle } from "lightweight-charts";
import axios from "../../lib/axios";
import { Loader, AlertCircle } from "lucide-react";

const AltcoinSeasonChart = () => {
  const chartContainerRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/altcoin-chart-data");
        const formattedData = response.data.data.map((item) => ({
          time: item.date,
          value: parseFloat(item.value),
        }));
        setChartData(formattedData);
        setError(null);
      } catch (err) {
        setError("Failed to load Altcoin Season data");
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    if (chartData.length === 0 || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#333",
      },
      grid: {
        vertLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
        horzLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
      },
      priceScale: {
        position: "right",
        borderVisible: false,
        minimumValue: -20,
        maximumValue: 120,
        autoScale: true,
      },
      timeScale: {
        borderVisible: false,
      },
    });

    const series = chart.addLineSeries({
      color: "#000000",
      lineWidth: 2,
    });

    series.setData(chartData);

    series.createPriceLine({
      price: 75,
      color: "#345C99",
      lineWidth: 2,
      lineStyle: LineStyle.Solid,
      axisLabelVisible: true,
      title: "▲ Altcoin Year - 75",
    });

    series.createPriceLine({
      price: 25,
      color: "#345C99",
      lineWidth: 2,
      lineStyle: LineStyle.Solid,
      axisLabelVisible: true,
      title: "▼ Bitcoin Year - 25",
    });

    chart.timeScale().setVisibleRange({
      from: Date.parse("2023-01-01") / 1000,
      to: Date.parse("2024-12-31") / 1000,
    });

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        background: `linear-gradient(0deg, 
        rgba(219,71,76,.9) 5%, 
        rgba(253,181,103,.7) 20%, 
        rgba(252,254,187,.7) 35%, 
        rgba(151,213,164,.6) 40%, 
        rgba(72,153,183,.5) 50%, 
        rgba(151,213,164,.6) 60%, 
        rgba(252,254,187,.7) 70%, 
        rgba(253,181,103,.7) 84%, 
        rgba(219,71,76,.9) 95%)`,
      }}
    >
      <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default AltcoinSeasonChart;
