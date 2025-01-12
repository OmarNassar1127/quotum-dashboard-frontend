import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Info, Loader2 } from "lucide-react";
import axios from "../../lib/axios";
import { format } from "date-fns";

const BitcoinRetail = () => {
  const [retailData, setRetailData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/platform/bitcoin/retail");
        const processedData = response.data.map((item) => ({
          date: item.transaction_day * 1000, // Convert to milliseconds
          price: Number(item.daily_btc_price),
          retail: Number(item.retail),
        }));
        setRetailData(processedData);
        setError(null);
      } catch (err) {
        setError("Failed to load Bitcoin retail data");
        console.error("Error fetching Bitcoin retail data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const date = new Date(label);
    const price = payload.find((p) => p.dataKey === "price")?.value;
    const retail = payload.find((p) => p.dataKey === "retail")?.value;

    return (
      <div className="bg-[#000] bg-opacity-80 border border-[#333] p-4 rounded shadow text-gray-100">
        <p className="text-sm font-medium">{format(date, "MMM d, yyyy")}</p>
        {price && (
          <p className="text-sm">BTC Price: ${price.toLocaleString()}</p>
        )}
        {retail !== null && (
          <p className="text-sm">Retail Change: {retail.toFixed(2)}%</p>
        )}
      </div>
    );
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-[#111] text-white border border-[#222]">
        <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 md:p-6 bg-[#111] text-white rounded-md border border-[#222]">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-4">
          BTC: Retail Investor Demand 30D Change
        </h2>

        <div className="relative bg-[#222] border border-[#333] rounded-md p-4">
          <div
            ref={chartContainerRef}
            className="h-[400px] md:h-[600px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={retailData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <ReferenceLine
                  yAxisId="right"
                  y={0}
                  strokeDasharray="3 3"
                  stroke="#666"
                />
                <ReferenceLine
                  yAxisId="right"
                  y={10}
                  strokeDasharray="3 3"
                  stroke="#666"
                />
                <ReferenceLine
                  yAxisId="right"
                  y={-10}
                  strokeDasharray="3 3"
                  stroke="#666"
                />
                <ReferenceLine
                  yAxisId="right"
                  label={{ value: "Bottom", fill: "#22c55e" }}
                  y={-20}
                  strokeDasharray="3 3"
                  stroke="#666"
                />

                <XAxis dataKey="date" tick={false} stroke="#aaa" />

                <YAxis
                  yAxisId="left"
                  orientation="left"
                  scale="log"
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="#aaa"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                  stroke="#aaa"
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Line
                  yAxisId="left"
                  type="basis"
                  dataKey="price"
                  name="BTC Price"
                  stroke="#fff"
                  dot={false}
                  strokeWidth={1}
                />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="retail"
                  name="Retail Change"
                  stroke="#22c55e"
                  dot={false}
                  strokeWidth={2}
                />

                <Brush
                  dataKey="date"
                  height={40}
                  stroke="#666"
                  fill="#222"
                  travellerWidth={10}
                  tickFormatter={() => ""}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">About This Metric</h3>
            <p className="text-gray-300">
              This chart tracks the 30-day change in retail investor demand for
              Bitcoin, focusing on transactions between $0 to $10K USD. The
              metric helps identify shifts in small-scale investor behavior and
              market sentiment.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">
                A positive percentage indicates increasing retail participation,
                while negative values suggest declining retail interest. The
                overlay with BTC price helps visualize how retail sentiment
                correlates with price movements.
              </p>
              <p className="text-gray-300">
                Key reference lines at +10% and -10% mark significant shifts in
                retail behavior that often precede larger market moves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinRetail;
