import React from "react";
import { Info } from "lucide-react";

const ETFInflow = () => {
  return (
    <div className="space-y-6">
      {/* Main Chart Container */}
      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Bitcoin ETF Flows
        </h2>

        {/* Chart Container with Overlay */}
        <div className="relative w-full h-[420px] bg-[#111] rounded-lg overflow-hidden">
          <iframe
            src="https://www.theblock.co/data/crypto-markets/bitcoin-etf/spot-bitcoin-etf-flows/embed"
            title="Spot Bitcoin ETF Flows"
            className="absolute top-0 left-0 w-full h-full"
            style={{
              border: "none",
              backgroundColor: "#111",
            }}
          />
          {/* Overlay to hide footer text */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "20px", // Adjust height to cover the footer text
              backgroundColor: "#111", // Match the iframe background color
              pointerEvents: "none", // Ensure clicks pass to the iframe
            }}
          ></div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-[#111] rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              This chart displays the daily inflows and outflows for spot
              Bitcoin ETFs, showing the net movement of funds across all
              providers including BlackRock (IBIT), Fidelity (FBTC), and others.
              Positive values indicate net inflows while negative values
              represent net outflows.
            </p>
            <p className="text-sm text-gray-400">
              ETF flows are a key indicator of institutional and retail interest
              in Bitcoin, providing insights into market sentiment and adoption
              trends in traditional financial markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETFInflow;
