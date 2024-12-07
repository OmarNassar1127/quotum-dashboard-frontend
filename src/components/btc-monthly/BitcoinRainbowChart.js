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
  const I_DECREASE = 1.5; // Adding the decrease factor from Python version
  const EXTEND_WEEKS = 104; // Extend by two years

  useEffect(() => {
    if (!chartRef.current || chartLoading || !bitcoinData?.length) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Prepare data
    const preparedData = bitcoinData.map((item) => ({
      date: new Date(item.date).getTime(),
      price: item.price,
    }));

    // Sort data by date to ensure correctness
    preparedData.sort((a, b) => a.date - b.date);

    // Set the start time to the first data point's date
    const startTime = preparedData[0].date;

    // Calculate days since start date and convert to weeks
    const weeksSinceStart = preparedData.map(
      (item) => (item.date - startTime) / (7 * 24 * 60 * 60 * 1000)
    );

    // Ensure weeksSinceStart values are greater than zero
    let startIndex = weeksSinceStart.findIndex((w) => w > 0);
    if (startIndex === -1) startIndex = 0;

    const xData = weeksSinceStart.slice(startIndex).map((x) => Math.log(x));
    const yData = preparedData
      .slice(startIndex)
      .map((item) => Math.log(item.price));

    // Perform linear regression
    const n = xData.length;
    const sumX = xData.reduce((sum, x) => sum + x, 0);
    const sumY = yData.reduce((sum, y) => sum + y, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumX2 = xData.reduce((sum, x) => sum + x * x, 0);

    const a_value = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b_value = (sumY - a_value * sumX) / n;

    // Extend dates for projection
    const extendedDates = [];
    const lastDate = preparedData[preparedData.length - 1].date;

    for (let i = 1; i <= EXTEND_WEEKS; i++) {
      const nextDate = lastDate + i * 7 * 24 * 60 * 60 * 1000;
      extendedDates.push(nextDate);
    }

    const allDates = preparedData
      .map((item) => item.date)
      .concat(extendedDates);

    // Calculate weeks since start for all dates
    const extendedWeeksSinceStart = allDates.map(
      (date) => (date - startTime) / (7 * 24 * 60 * 60 * 1000)
    );

    // Filter out non-positive values for logarithm
    const validIndices = extendedWeeksSinceStart
      .map((x, idx) => (x > 0 ? idx : null))
      .filter((idx) => idx !== null);

    const extendedXData = validIndices.map((idx) =>
      Math.log(extendedWeeksSinceStart[idx])
    );

    // Calculate fitted values
    const extendedFittedYData = extendedXData.map((x) => a_value * x + b_value);

    // Calculate base price curve
    const price_base = extendedFittedYData.map((y) => Math.exp(y));

    // Align dates with valid indices
    const validDates = validIndices.map((idx) => allDates[idx]);

    // Construct rainbow bands
    const bands = [];
    for (let i = 0; i < NUM_BANDS; i++) {
      // Using the same calculation method as the Python version
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

    // Create band series by stacking the differences
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

    // Price series
    const priceSeries = {
      name: "BTC Price",
      type: "line",
      data: preparedData.map((item) => [item.date, item.price]),
      lineStyle: { color: "white", width: 2 },
      symbol: "none",
      z: 10,
      smooth: 0.3,
    };

    // Add halving dates
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

    const options = {
      tooltip: {
        trigger: "axis",
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
          color: "white",
          fontSize: 12,
          formatter: (value) => format(new Date(value), "yyyy"),
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: "white" } },
        axisTick: { lineStyle: { color: "white" } },
      },
      yAxis: {
        type: "log",
        logBase: 10,
        min: 0.1,
        max: 1000000,
        axisLabel: {
          color: "white",
          fontSize: 12,
          formatter: (value) => {
            if (value < 1) return `$${value.toFixed(2)}`;
            if (value < 1000) return `$${value}`;
            if (value < 1000000) return `$${value / 1000}K`;
            return `$${value / 1000000}M`;
          },
        },
        splitLine: {
          show: true,
          lineStyle: { color: "#444", type: "dashed" },
        },
        axisLine: { lineStyle: { color: "white" } },
        axisTick: { lineStyle: { color: "white" } },
      },
      series: [...bandSeries, priceSeries],
      legend: {
        data: ["BTC Price", ...Object.values(COLORS_LABELS)],
        textStyle: { color: "white", fontSize: 12 },
        top: -5,
        itemWidth: 15,
        itemHeight: 15,
      },
      grid: {
        left: "5%",
        right: "5%",
        top: "8%",
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
          borderColor: "transparent",
          backgroundColor: "#444",
          fillerColor: "rgba(255, 255, 255, 0.2)",
          handleIcon:
            "path://M-9.35,27.3L-3.65,27.3L-3.65,-27.3L-9.35,-27.3L-9.35,27.3Z M3.65,-27.3L3.65,27.3L9.35,27.3L9.35,-27.3L3.65,-27.3Z",
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
    <div className="bg-black rounded-lg shadow-sm p-6 min-h-[24rem]">
      {chartError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {chartError}
        </div>
      )}
      <div className="relative">
        <div ref={chartRef} className="h-[500px] w-full" />
        {chartLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <Loader className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BitcoinRainbowChart;
