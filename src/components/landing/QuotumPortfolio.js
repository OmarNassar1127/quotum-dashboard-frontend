import React from "react";
import btc from "../../assets/bitcoin.webp";
import eth from "../../assets/ethereum.webp";
import solana from "../../assets/solana.webp";
import rio from "../../assets/rio.webp";
import ghx from "../../assets/ghx.webp";
import pano from "../../assets/pano.webp";
import cell from "../../assets/cell.webp";

// Example data with name & local image
const coinData = [
  { name: "Bitcoin", logo: btc },
  { name: "Ethereum", logo: eth },
  { name: "Solana", logo: solana },
  { name: "Realio Network", logo: rio },
  { name: "GamerCoin", logo: ghx },
  { name: "Pano", logo: pano },
  { name: "Cell", logo: cell },
];

const QuotumPortfolio = () => {
  return (
    <section className="py-12 bg-gray-50 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Quotum Portfolio
        </h2>
        {/* Outer container: hidden overflow to clip the scrolling content */}
        <div className="relative w-full overflow-hidden">
          {/* Inner container: 200% width so that two copies can scroll seamlessly */}
          <div className="flex w-[200%] animate-marquee">
            {/* First copy of your coin list */}
            <div className="flex w-[50%] justify-around">
              {coinData.map((coin) => (
                <div
                  key={coin.name}
                  className="flex flex-col items-center w-24 mx-2 text-center"
                >
                  <img
                    src={coin.logo}
                    alt={coin.name}
                    className="w-10 h-10 mb-2 rounded-full"
                  />
                  <span className="text-gray-800 text-sm font-medium">
                    {coin.name}
                  </span>
                </div>
              ))}
            </div>
            {/* Second copy (duplicate) for seamless looping */}
            <div className="flex w-[50%] justify-around">
              {coinData.map((coin) => (
                <div
                  key={coin.name + "_2"}
                  className="flex flex-col items-center w-24 mx-2 text-center"
                >
                  <img
                    src={coin.logo}
                    alt={coin.name}
                    className="w-10 h-10 mb-2 rounded-full"
                  />
                  <span className="text-gray-800 text-sm font-medium">
                    {coin.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuotumPortfolio;
