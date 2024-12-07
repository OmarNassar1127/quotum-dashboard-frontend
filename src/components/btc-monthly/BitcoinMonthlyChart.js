import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { format } from "date-fns";
import { interpolateRgb } from "d3-interpolate";
import { AlertCircle, Loader, TrendingUp } from "lucide-react";

const BitcoinChartCard = ({
  bitcoinData,
  chartError,
  chartLoading,
  currentMonthOpen,
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

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize ECharts instance
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    if (chartLoading || !bitcoinData?.length) {
      chartInstance.current.clear();
      return;
    }

    // Format data for scatter plot (colored dots)
    const scatterData = bitcoinData.map((item) => ({
      name: format(new Date(item.date), "MMMM yyyy"),
      value: [new Date(item.date).getTime(), item.price],
      itemStyle: {
        color: interpolateColors(
          Math.max(Math.min(estimateMonthsUntilHalving(item.date), 50), 0)
        ),
      },
    }));

    // Format data for line plot
    const lineData = bitcoinData.map((item) => [
      new Date(item.date).getTime(),
      item.price,
    ]);

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
            )}<br/>$${validParam.value[1].toLocaleString()}`;
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
        type: "log",
        axisLabel: {
          formatter: (value) => `$${value.toLocaleString()}`,
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
          name: "Price",
          type: "scatter",
          symbolSize: 8,
          data: scatterData,
          z: 10,
        },
        {
          name: "Trend",
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
      ],
    };

    // Add reference line for current month open
    if (currentMonthOpen) {
      options.series.push({
        name: "Current Month Open",
        type: "line",
        markLine: false,
        showSymbol: false,
        tooltip: { show: false },
        data: [
          [
            { coord: [lineData[0][0], currentMonthOpen] },
            { coord: [lineData[lineData.length - 1][0], currentMonthOpen] },
          ],
        ],
        lineStyle: {
          type: "dashed",
          color: "grey",
        },
        z: 8,
      });
    }

    // Add vertical line for current month
    if (bitcoinData.length > 0) {
      const lastDate = new Date(
        bitcoinData[bitcoinData.length - 1].date
      ).getTime();
      options.series.push({
        name: "Current Month Line",
        type: "line",
        markLine: false,
        showSymbol: false,
        tooltip: { show: false },
        data: [
          [
            { coord: [lastDate, options.yAxis.min || 1] },
            {
              coord: [lastDate, bitcoinData[bitcoinData.length - 1].price],
            },
          ],
        ],
        lineStyle: {
          color: currentMonthColor,
          width: 2,
        },
        label: {
          show: true,
          position: "end",
          formatter: "Current Month",
        },
        z: 8,
      });
    }

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
    currentMonthOpen,
    currentMonthColor,
    estimateMonthsUntilHalving,
  ]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[24rem]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            BTC Monthly Rainbow Chart
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

export default BitcoinChartCard;
