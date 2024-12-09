import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { Loader2, Info } from "lucide-react";
import axios from "../../lib/axios";
import { format, addMonths } from "date-fns";
import FeatureRestricted from "../restricted/FeatureRestricted";

const NUPLIndicator = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartWidth, setChartWidth] = useState(0);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricesResponse, nuplResponse] = await Promise.all([
          axios.get("/platform/bitcoin/daily"),
          axios.get("/platform/bitcoin/nupl"),
        ]);

        const combinedData = nuplResponse.data.map((nuplPoint) => {
          const matchingPrice = pricesResponse.data.find(
            (pricePoint) => pricePoint.time === nuplPoint.time
          );

          return {
            date: nuplPoint.time * 1000,
            price: matchingPrice ? Number(matchingPrice.value) : null,
            nupl: Number(nuplPoint.value),
          };
        });

        const lastDate = new Date(combinedData[combinedData.length - 1].date);
        const futureData = Array.from({ length: 12 }, (_, i) => ({
          date: addMonths(lastDate, i + 1).getTime(),
          price: null,
          nupl: null,
        }));

        setData([...combinedData, ...futureData]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const priceValue = payload.find((p) => p.dataKey === "price")?.value;
    const nuplValue = payload.find((p) => p.dataKey === "nupl")?.value;

    return (
      <div className="bg-[#000] bg-opacity-80 border border-[#333] p-4 rounded shadow text-gray-100">
        <p className="text-sm font-medium">
          {format(new Date(label), "MMM d, yyyy")}
        </p>
        {priceValue && (
          <p className="text-sm">Price: ${priceValue.toLocaleString()}</p>
        )}
        {nuplValue !== undefined && nuplValue !== null && (
          <p className="text-sm">NUPL: {(nuplValue * 100).toFixed(2)}%</p>
        )}
      </div>
    );
  };

  // Calculate ticks for every 2 years
  const getCustomTicks = () => {
    if (!data.length) return [];
    const years = data.map((item) => new Date(item.date).getFullYear());
    const startYear = Math.min(...years);
    const endYear = Math.max(...years);
    const ticks = [];

    for (let year = startYear; year <= endYear; year += 2) {
      const date = new Date(year, 0, 1).getTime();
      if (
        date >= Math.min(...data.map((d) => d.date)) &&
        date <= Math.max(...data.map((d) => d.date))
      ) {
        ticks.push(date);
      }
    }
    return ticks;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-[#111] text-white min-h-screen border border-[#222]">
        <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
          <div className="flex items-center justify-center h-[400px] md:h-[600px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-[#111] text-white min-h-screen border border-[#222]">
        <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
          <div className="flex items-center justify-center h-[400px] md:h-[600px]">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#111] text-white min-h-screen border border-[#222]">
      <h1 className="text-xl md:text-2xl font-bold text-gray-100 mb-2">
        Bitcoin Net Unrealized Profit/Loss (NUPL)
      </h1>

      <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
        <FeatureRestricted feature="btc_nupl">
          <div
            ref={chartContainerRef}
            className="h-[400px] md:h-[600px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 50,
                }}
              >
                {/* Color Backgrounds */}
                <ReferenceArea
                  yAxisId="left"
                  y1={0.75}
                  y2={1}
                  stroke="none"
                  fill="#FF0000"
                  fillOpacity={0.1}
                />
                <ReferenceArea
                  yAxisId="left"
                  y1={0.5}
                  y2={0.75}
                  stroke="none"
                  fill="#FF7F00"
                  fillOpacity={0.1}
                />
                <ReferenceArea
                  yAxisId="left"
                  y1={0.25}
                  y2={0.5}
                  stroke="none"
                  fill="#FFFF00"
                  fillOpacity={0.1}
                />
                <ReferenceArea
                  yAxisId="left"
                  y1={0}
                  y2={0.25}
                  stroke="none"
                  fill="#00FF00"
                  fillOpacity={0.1}
                />
                <ReferenceArea
                  yAxisId="left"
                  y1={-1.5}
                  y2={0}
                  stroke="none"
                  fill="#333333"
                  fillOpacity={0.3}
                />

                {/* Reference Lines */}
                <ReferenceLine
                  yAxisId="left"
                  y={1}
                  strokeDasharray="3 3"
                  stroke="#FF0000"
                />
                <ReferenceLine
                  yAxisId="left"
                  y={0.75}
                  strokeDasharray="3 3"
                  stroke="#FF7F00"
                />
                <ReferenceLine
                  yAxisId="left"
                  y={0.5}
                  strokeDasharray="3 3"
                  stroke="#FFFF00"
                />
                <ReferenceLine
                  yAxisId="left"
                  y={0.25}
                  strokeDasharray="3 3"
                  stroke="#00FF00"
                />
                <ReferenceLine
                  yAxisId="left"
                  y={0}
                  strokeDasharray="3 3"
                  stroke="#666"
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={(timestamp) =>
                    format(new Date(timestamp), "yyyy")
                  }
                  ticks={getCustomTicks()}
                  stroke="#aaa"
                  domain={["dataMin", "dataMax"]}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  domain={[-1.5, 1]}
                  stroke="#aaa"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  scale="log"
                  domain={[1, 200000]}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toLocaleString();
                  }}
                  stroke="#aaa"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="price"
                  stroke="#fff"
                  dot={false}
                  strokeWidth={1.7}
                  name="BTC Price"
                  connectNulls={true}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="nupl"
                  stroke="#00FFFF"
                  dot={false}
                  strokeWidth={1.7}
                  name="NUPL"
                  connectNulls={true}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Brush
                  dataKey="date"
                  height={40}
                  stroke="#666"
                  fill="#222"
                  tickFormatter={(timestamp) =>
                    format(new Date(timestamp), "yyyy")
                  }
                  startIndex={0}
                  endIndex={data.length - 1}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </FeatureRestricted>
      </div>

      <div className="mt-6 space-y-6 text-gray-300">
        <div className="bg-[#222] rounded-lg p-4 md:p-6 border border-[#333]">
          <h2 className="text-base md:text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Market Phases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 bg-opacity-30 rounded" />
              <span>Euphoria/Greed (≥ 0.75)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 bg-opacity-30 rounded" />
              <span>Belief/Denial (0.5 - 0.75)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 bg-opacity-30 rounded" />
              <span>Optimism/Anxiety (0.25 - 0.5)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 bg-opacity-30 rounded" />
              <span>Hope/Fear (≤ 0.25)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#222] rounded-lg p-4 md:p-6 border border-[#333]">
          <h2 className="text-base md:text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Indicator Overview
          </h2>
          <div className="space-y-4 text-xs md:text-sm">
            <p>
              This indicator is derived from Market Value and Realized Value,
              which can be defined as: Market Value: The current price of
              Bitcoin multiplied by the number of coins in circulation. This is
              like market cap in traditional markets i.e. share price multiplied
              by number of shares. Realized Value: Rather than taking the
              current price of Bitcoin, Realized Value takes the price of each
              Bitcoin when it was last moved i.e. the last time it was sent from
              one wallet to another wallet. It then adds up all those individual
              prices and takes an average of them. It then multiplies that
              average price by the total number of coins in circulation. By
              subtracting Realized Value from Market Value we calculate
              Unrealized Profit/Loss. Unrealized Profit/Loss estimates the total
              paper profits/losses in Bitcoin held by investors. This is
              interesting to know but of greater value is identifying how this
              changes relatively over time. To do this we can divide Unrealized
              Profit/Loss by Market Cap. This creates Net Unrealized
              Profit/Loss, sometimes referred to as NUPL, which is very useful
              to track investor sentiment over time for Bitcoin. Relative
              Unrealised Profit/Loss is another name used for this analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NUPLIndicator;
