import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { format } from "date-fns";
import { interpolateRgb } from "d3-interpolate";
import { AlertCircle, Loader, TrendingUp } from "lucide-react";

const BitcoinMonthlyRsiChart = ({
  bitcoinData,
  chartError,
  chartLoading,
  currentMonthColor,
  estimateMonthsUntilHalving,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const colorDict = {
    0: "#0000ff",
    10: "#00ffff",
    20: "#00ff00",
    30: "#ffff00",
    50: "#ff0000",
  };

  const interpolateColors = (value) => {
    const points = Object.keys(colorDict).map(Number);
    const colors = Object.values(colorDict);

    for (let i = 0; i < points.length - 1; i++) {
      if (value >= points[i] && value <= points[i + 1]) {
        const t = (value - points[i]) / (points[i + 1] - points[i]);
        return interpolateRgb(colors[i], colors[i + 1])(t);
      }
    }
    return colors[colors.length - 1];
  };

  const calculateRSI = (data, periods = 14) => {
    if (data.length < periods + 1) {
      return Array(data.length).fill(null);
    }

    // Calculate price changes
    const changes = data.map((item, i) => {
      if (i === 0) return 0;
      return item.price - data[i - 1].price;
    });

    // Calculate gains and losses
    let gains = changes.map((change) => (change > 0 ? change : 0));
    let losses = changes.map((change) => (change < 0 ? Math.abs(change) : 0));

    // Calculate initial averages
    let avgGain =
      gains.slice(1, periods + 1).reduce((sum, gain) => sum + gain, 0) /
      periods;
    let avgLoss =
      losses.slice(1, periods + 1).reduce((sum, loss) => sum + loss, 0) /
      periods;

    const rsi = Array(periods).fill(null);

    // Calculate RSI values
    for (let i = periods + 1; i < changes.length; i++) {
      avgGain = (avgGain * (periods - 1) + gains[i]) / periods;
      avgLoss = (avgLoss * (periods - 1) + losses[i]) / periods;

      const rs = avgLoss === 0 ? 0 : avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    }

    return rsi;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    if (chartLoading || !bitcoinData?.length) {
      chartInstance.current.clear();
      return;
    }

    // Calculate RSI
    const rsiValues = calculateRSI(bitcoinData, 14);

    // Format data for scatter plot (colored dots)
    const scatterData = bitcoinData
      .map((item, index) => {
        if (rsiValues[index] === null || rsiValues[index] === undefined)
          return null;
        return {
          name: format(new Date(item.date), "MMMM yyyy"),
          value: [new Date(item.date).getTime(), rsiValues[index]],
          itemStyle: {
            color: interpolateColors(
              Math.max(Math.min(estimateMonthsUntilHalving(item.date), 50), 0)
            ),
          },
        };
      })
      .filter(Boolean);

    // Format data for line plot
    const lineData = scatterData.map((item) => item.value);

    const options = {
      animation: false,
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          const validParam = params.find(
            (p) => p.value && p.value[1] !== undefined
          );
          if (validParam) {
            return `${format(
              new Date(validParam.value[0]),
              "MMMM yyyy"
            )}<br/>RSI: ${validParam.value[1].toFixed(2)}`;
          }
          return "";
        },
      },
      grid: {
        left: "10%",
        right: "5%",
        top: "5%",
        bottom: "70px",
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: (value) => format(new Date(value), "MMM yyyy"),
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 10,
        axisLabel: {
          formatter: (value) => value.toFixed(0),
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            opacity: 0.5,
          },
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
          minValueSpan: 3600 * 24 * 1000 * 30,
        },
        {
          show: true,
          type: "slider",
          bottom: 10,
          start: 0,
          end: 100,
          minValueSpan: 3600 * 24 * 1000 * 30,
          height: 40,
          borderColor: "transparent",
          backgroundColor: "#f1f5f9",
          fillerColor: "rgba(167, 182, 194, 0.3)",
          handleIcon:
            "path://M-9.35,27.3L-3.65,27.3L-3.65,-27.3L-9.35,-27.3L-9.35,27.3Z M3.65,-27.3L3.65,27.3L9.35,27.3L9.35,-27.3L3.65,-27.3Z",
          handleSize: "120%",
          handleStyle: {
            color: "#fff",
            borderColor: "#ACB8C1",
          },
          moveHandleSize: 6,
        },
      ],
      series: [
        {
          name: "RSI",
          type: "scatter",
          symbolSize: 8,
          data: scatterData,
          z: 10,
        },
        {
          name: "RSI Line",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: lineData,
          lineStyle: {
            color: "grey",
            width: 1,
          },
          z: 9,
        },
        {
          name: "Overbought",
          type: "line",
          markLine: false,
          showSymbol: false,
          tooltip: { show: false },
          data: [
            [
              { coord: [lineData[0][0], 70] },
              { coord: [lineData[lineData.length - 1][0], 70] },
            ],
          ],
          lineStyle: {
            type: "dashed",
            color: "#ef4444",
          },
          z: 8,
        },
        {
          name: "Oversold",
          type: "line",
          markLine: false,
          showSymbol: false,
          tooltip: { show: false },
          data: [
            [
              { coord: [lineData[0][0], 30] },
              { coord: [lineData[lineData.length - 1][0], 30] },
            ],
          ],
          lineStyle: {
            type: "dashed",
            color: "#22c55e",
          },
          z: 8,
        },
      ],
    };

    // Set options
    chartInstance.current.setOption(options, true);

    // Handle resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [
    bitcoinData,
    chartLoading,
    currentMonthColor,
    estimateMonthsUntilHalving,
  ]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[24rem]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            BTC Monthly Rainbow RSI
          </h2>
        </div>
      </div>

      {chartError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {chartError}
        </div>
      )}

      <div className="relative">
        <div ref={chartRef} className="h-[300px] w-full" />
        {chartLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BitcoinMonthlyRsiChart;
