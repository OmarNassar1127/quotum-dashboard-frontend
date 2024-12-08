import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { format } from "date-fns";
import { Loader, AlertCircle } from "lucide-react";

const BitcoinRainbowChart = ({ bitcoinData, chartError, chartLoading }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const COLORS_LABELS = {
    "#c00200": "Maximum bubble territory",
    "#d64018": "Sell. Seriously, SELL!",
    "#ed7d31": "FOMO intensifies",
    "#f6b45a": "Is this a bubble?",
    "#feeb84": "HODL!",
    "#b1d580": "Still cheap",
    "#63be7b": "Accumulate",
    "#54989f": "BUY!",
    "#4472c4": "Fire sale!",
  };

  const BAND_WIDTH = 0.3; // Matching Python version
  const NUM_BANDS = 9;
  const I_DECREASE = 1.5; // Decrease factor from Python version
  const EXTEND_WEEKS = 104; // Extend by two years

  useEffect(() => {
    if (!chartRef.current || chartLoading || !bitcoinData?.length) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // --- Existing Logic & Formulas (unchanged) ---
    const preparedData = bitcoinData.map((item) => ({
      date: new Date(item.date).getTime(),
      price: item.price,
    }));

    preparedData.sort((a, b) => a.date - b.date);

    const startTime = preparedData[0].date;
    const weeksSinceStart = preparedData.map(
      (item) => (item.date - startTime) / (7 * 24 * 60 * 60 * 1000)
    );

    let startIndex = weeksSinceStart.findIndex((w) => w > 0);
    if (startIndex === -1) startIndex = 0;

    const xData = weeksSinceStart.slice(startIndex).map((x) => Math.log(x));
    const yData = preparedData
      .slice(startIndex)
      .map((item) => Math.log(item.price));

    const n = xData.length;
    const sumX = xData.reduce((sum, x) => sum + x, 0);
    const sumY = yData.reduce((sum, y) => sum + y, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumX2 = xData.reduce((sum, x) => sum + x * x, 0);

    const a_value = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b_value = (sumY - a_value * sumX) / n;

    const extendedDates = [];
    const lastDate = preparedData[preparedData.length - 1].date;
    for (let i = 1; i <= EXTEND_WEEKS; i++) {
      const nextDate = lastDate + i * 7 * 24 * 60 * 60 * 1000;
      extendedDates.push(nextDate);
    }

    const allDates = preparedData
      .map((item) => item.date)
      .concat(extendedDates);
    const extendedWeeksSinceStart = allDates.map(
      (date) => (date - startTime) / (7 * 24 * 60 * 60 * 1000)
    );

    const validIndices = extendedWeeksSinceStart
      .map((x, idx) => (x > 0 ? idx : null))
      .filter((idx) => idx !== null);

    const extendedXData = validIndices.map((idx) =>
      Math.log(extendedWeeksSinceStart[idx])
    );

    const extendedFittedYData = extendedXData.map((x) => a_value * x + b_value);
    const price_base = extendedFittedYData.map((y) => Math.exp(y));
    const validDates = validIndices.map((idx) => allDates[idx]);

    const bands = [];
    for (let i = 0; i < NUM_BANDS; i++) {
      const lowerBound = price_base.map((price) =>
        Math.exp(Math.log(price) + (i - I_DECREASE) * BAND_WIDTH - BAND_WIDTH)
      );
      const upperBound = price_base.map((price) =>
        Math.exp(Math.log(price) + (i - I_DECREASE) * BAND_WIDTH)
      );

      const color = Object.keys(COLORS_LABELS).reverse()[i];
      const label = Object.values(COLORS_LABELS).reverse()[i];
      bands.push({ lowerBound, upperBound, color, label });
    }

    const bandSeries = [];
    let previousUpperBound = new Array(price_base.length).fill(0);

    bands.forEach((band) => {
      const bandData = band.upperBound.map(
        (upper, idx) => upper - previousUpperBound[idx]
      );

      bandSeries.push({
        name: band.label,
        type: "line",
        data: validDates.map((date, idx) => [date, bandData[idx]]),
        areaStyle: {
          color: band.color,
          opacity: 1,
        },
        lineStyle: {
          width: 0,
        },
        symbol: "none",
        stack: "bands",
        silent: true,
        smooth: 0.3,
      });

      previousUpperBound = band.upperBound;
    });

    const priceSeries = {
      name: "BTC Price",
      type: "line",
      data: preparedData.map((item) => [item.date, item.price]),
      lineStyle: { color: "white", width: 2 },
      symbol: "none",
      z: 10,
      smooth: 0.3,
    };

    const halvingDates = [
      new Date("2012-11-28").getTime(),
      new Date("2016-07-09").getTime(),
      new Date("2020-05-11").getTime(),
      new Date("2024-04-20").getTime(),
    ];

    const markLines = halvingDates.map((date) => ({
      xAxis: date,
      lineStyle: {
        color: "white",
        type: "dashed",
        opacity: 0.5,
      },
      label: {
        formatter: "Halving",
        position: "insideEndTop",
        color: "white",
        fontSize: 12,
      },
    }));

    // --- Styling changes only ---
    const options = {
      backgroundColor: "#111",
      textStyle: { color: "#ccc" },
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
          const param = params.find((p) => p.seriesName === "BTC Price");
          if (param) {
            const date = format(new Date(param.value[0]), "MMM d, yyyy");
            const price = param.value[1];
            if (price < 1) return `${date}<br/>Price: $${price.toFixed(4)}`;
            if (price < 10) return `${date}<br/>Price: $${price.toFixed(2)}`;
            if (price < 1000) return `${date}<br/>Price: $${price.toFixed(1)}`;
            if (price < 1000000)
              return `${date}<br/>Price: $${(price / 1000).toFixed(1)}K`;
            return `${date}<br/>Price: $${(price / 1000000).toFixed(1)}M`;
          }
          return "";
        },
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
        axisLabel: {
          color: "#aaa",
          fontSize: 12,
          formatter: (value) => format(new Date(value), "yyyy"),
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "#333" } },
        axisTick: { lineStyle: { color: "#333" } },
      },
      yAxis: {
        type: "log",
        logBase: 10,
        min: 0.1,
        max: 1000000,
        axisLabel: {
          color: "#aaa",
          fontSize: 12,
          formatter: (value) => {
            if (value < 1) return `$${value.toFixed(2)}`;
            if (value < 1000) return `$${value}`;
            if (value < 1000000) return `$${(value / 1000).toFixed(0)}K`;
            return `$${(value / 1000000).toFixed(0)}M`;
          },
        },
        splitLine: { lineStyle: { color: "#333", type: "dashed" } },
        axisLine: { lineStyle: { color: "#333" } },
        axisTick: { lineStyle: { color: "#333" } },
      },
      series: [...bandSeries, priceSeries],
      legend: {
        data: ["BTC Price", ...Object.values(COLORS_LABELS)],
        textStyle: { color: "white", fontSize: 12 },
        top: "5%",
        itemWidth: 15,
        itemHeight: 15,
      },
      grid: {
        left: "5%",
        right: "5%",
        top: "20%",
        bottom: "15%",
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 0,
          end: 100,
          bottom: 0,
          height: 20,
          borderColor: "#333",
          backgroundColor: "#222",
          fillerColor: "rgba(255, 255, 255, 0.2)",
          handleSize: "80%",
          handleStyle: {
            color: "#fff",
            borderColor: "#ACB8C1",
          },
        },
        {
          type: "inside",
        },
      ],
      markLine: {
        silent: true,
        data: markLines,
      },
    };

    chartInstance.current.setOption(options);

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [bitcoinData, chartLoading]);

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl shadow-sm p-6 min-h-[24rem] text-white">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        Bitcoin Fibonacci Curve Chart
      </h2>
      {chartError && (
        <div className="mb-4 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {chartError}
        </div>
      )}
      <div className="relative w-full">
        {/* Responsive height adjustments */}
        <div
          ref={chartRef}
          className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
        />
        {chartLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111] bg-opacity-75">
            <Loader className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BitcoinRainbowChart;
