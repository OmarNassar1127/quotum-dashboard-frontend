import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { Info, Loader2 } from "lucide-react";
import axios from "../../lib/axios";
import { format, startOfDay } from "date-fns";

const ShortTermBubble = () => {
  const [bitcoinWeeklyData, setBitcoinWeeklyData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate Simple Moving Average
  const calculateSMA = (data, period) => {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
        continue;
      }
      const sum = data
        .slice(i - period + 1, i + 1)
        .reduce((acc, val) => acc + val, 0);
      sma.push(sum / period);
    }
    return sma;
  };

  // Calculate Bubble Risk => close * 100 / SMA(20) - 100
  const calculateBubbleRisk = (prices) => {
    const sma = calculateSMA(prices, 20);
    return prices.map((price, i) =>
      sma[i] ? (price * 100) / sma[i] - 100 : null
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChartLoading(true);
        const response = await axios.get("/platform/bitcoin/weekly");
        const data = response.data.map((item) => ({
          ...item,
          date: startOfDay(new Date(item.week)).getTime(),
          price: Number(item.price),
        }));

        const prices = data.map((d) => d.price);
        const bubbleRisk = calculateBubbleRisk(prices);

        const processedData = data.map((item, index) => ({
          ...item,
          bubbleRisk: bubbleRisk[index],
        }));

        setBitcoinWeeklyData(processedData);
        setChartError(null);
      } catch (err) {
        setChartError("Failed to load Bitcoin weekly data");
        console.error("Error fetching Bitcoin weekly data:", err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchData();
  }, []);

  // Custom Tooltip with rounded bubbleRisk
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const date = new Date(label);
    const price = payload.find((p) => p.dataKey === "price")?.value;
    const risk = payload.find((p) => p.dataKey === "bubbleRisk")?.value;

    return (
      <div className="bg-[#000] bg-opacity-80 border border-[#333] p-4 rounded shadow text-gray-100">
        {/* We can still show the date inside the tooltip if we want */}
        <p className="text-sm font-medium">{format(date, "MMM d, yyyy")}</p>
        {price && <p className="text-sm">Price: ${price.toLocaleString()}</p>}
        {risk !== null && (
          <p className="text-sm">Bubble Risk: {Math.round(risk)}%</p>
        )}
      </div>
    );
  };

  if (chartLoading) {
    return (
      <div className="p-4 md:p-6 bg-[#111] text-white border border-[#222]">
        <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        </div>
      </div>
    );
  }

  if (chartError) {
    return (
      <div className="p-4 md:p-6 bg-[#111] text-white border border-[#222]">
        <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-red-500">{chartError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#111] text-white rounded-md border border-[#222]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-100">
          Short Term Bubble Risk
        </h2>
      </div>

      <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
        <div ref={chartContainerRef} className="h-[400px] md:h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={bitcoinWeeklyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              {/* Optional dashed line at 0% */}
              <ReferenceLine
                yAxisId="right"
                y={0}
                strokeDasharray="3 3"
                stroke="#666"
              />

              <defs>
                <linearGradient
                  id="bubbleRiskGradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#623af2" />
                  <stop offset="10%" stopColor="#00ff00" />
                  <stop offset="20%" stopColor="#ffff00" />
                  <stop offset="30%" stopColor="#ff0000" />
                  <stop offset="100%" stopColor="#ff0000" />
                </linearGradient>
              </defs>

              {/* 
                XAxis with no tick labels or lines:
                - tick={false} => hide label text
                - axisLine={false} => hide the axis line
                - tickLine={false} => hide the small tick marks
              */}
              <XAxis
                dataKey="date"
                tick={false}
                axisLine={false}
                tickLine={false}
                // If you do not even want the tooltip to show dates,
                // remove dataKey or remove the line above altogether.
              />

              <YAxis
                yAxisId="left"
                scale="log"
                domain={["auto", "auto"]}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                stroke="#aaa"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[-50, 100]}
                tickFormatter={(value) => `${Math.round(value)}%`}
                stroke="#aaa"
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* BTC Price */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                name="BTC Price"
                stroke="#fff"
                dot={false}
                strokeWidth={1}
              />

              {/* Bubble Risk with gradient */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bubbleRisk"
                name="Bubble Risk"
                stroke="url(#bubbleRiskGradient)"
                dot={false}
                strokeWidth={2}
              />

              {/* Brush for zoom/pan. If you want to hide the bottom axis,
                  you can also remove the brush or hide its ticks. */}
              <Brush
                dataKey="date"
                height={40}
                stroke="#666"
                fill="#222"
                tickFormatter={(timestamp) =>
                  format(new Date(timestamp), "yyyy")
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 space-y-6 text-gray-300">
        <div className="bg-[#222] rounded-lg p-6 border border-[#333]">
          <h2 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            About This Indicator
          </h2>

          <div className="space-y-4 text-sm">
            <p>
              The Short-Term Bubble Indicator (STBI) for Bitcoin provides a
              powerful visualization of price risk by comparing the closing
              price to the 20-week SMA. It includes a dynamic risk oscillator
              and supports both zoomed-in and zoomed-out views for maximum
              clarity.
            </p>

            <div>
              <h3 className="font-medium text-gray-100 mb-2">Description</h3>
              <p>
                The indicator’s risk oscillator highlights zones of high and low
                short-term risk, using a sleek color-coded gradient. The
                "zoomed-in" view offers detailed insights with 0.025 risk
                increments, while the "zoomed-out" view spans the entire 0-1
                risk range in 0.1 steps. Recent updates include customizable
                smoothing options with SMA and EMA.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-100 mb-2">Usage Guide</h3>
              <p>
                Traders can leverage the indicator to spot capitulation events
                and strategically place limit orders at lower risk levels.
                Dynamic risk levels adjust over time, ensuring your strategies
                align with market conditions. The tool’s flexibility makes it
                ideal for adapting to various trading styles and timeframes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortTermBubble;
