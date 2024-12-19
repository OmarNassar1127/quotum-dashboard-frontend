import React from "react";
import { ClockIcon, LogOut, CheckCircle } from "lucide-react";
import axios from "../../lib/axios";

const PricingTier = ({ title, prices, features, highlight }) => (
  <div
    className={`bg-[#111] rounded-lg p-6 
    border border-white/20 
    flex flex-col h-full justify-between 
    relative shadow-md shadow-white/10 
    ring-1 ring-white/10`}
  >
    {highlight && (
      <div className="absolute top-2 right-2 bg-[#32CD32] text-black text-xs font-bold py-1 px-2 rounded">
        Best Value
      </div>
    )}
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-2 text-base">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-[#32CD32] flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <div className="flex justify-center gap-2">
        {prices.map((price, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-baseline justify-center">
              <span className="text-2xl font-bold text-[#32CD32]">
                ${price.amount}
              </span>
              <span className="text-xs text-gray-400 ml-1">
                /{price.duration}
              </span>
            </div>
            <a
              href={price.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center mt-1 px-3 py-1.5 text-xs font-medium rounded-md text-black bg-[#32CD32] hover:bg-[#57e357] focus:outline-none focus:ring-2 focus:ring-[#32CD32] focus:ring-offset-2 transition-all shadow-sm shadow-[#32CD32]/20 ring-1 ring-[#32CD32]/50"
            >
              Order Now
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PendingActivation = () => {
  const handleLogout = async () => {
    try {
      await axios.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("active");
      setTimeout(() => window.location.reload(), 400);
    }
  };

  const basicFeatures = [
    "Step-by-Step Video Tutorials",
    "Weekly Market Updates",
    "VIP Telegram Channel",
    "Quotum Dashboard",
    "Market Risk Levels",
  ];

  const advancedFeatures = [
    "Full Basic Package",
    "Market Exit Signals",
    "Whale Sell Signals",
    <b key="support">1-on-1 direct support</b>,
    "Month 2 Upgrade",
  ];

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Side: Activation Message */}
        <div className="bg-[#111] rounded-lg shadow-md p-6 border border-white/20 flex flex-col justify-between shadow-white/10 ring-1 ring-white/10">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-green-200 p-3 flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Account Pending Activation
              </h2>
            </div>

            <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                Your account is currently under review by an administrator. This
                process may take some time. Once your account is activated, you
                will be notified via email or by the admins and gain access to
                all features.
              </p>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              Please log out and try again later or wait for a notification from
              the admin. Thank you for your patience!
            </p>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-black bg-[#32CD32] hover:bg-[#57e357] focus:outline-none focus:ring-2 focus:ring-[#32CD32] focus:ring-offset-2 transition-all"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Right Side: Pricing */}
        <div className="flex items-start gap-4">
          <PricingTier
            title="Basic"
            prices={[
              {
                amount: "75",
                duration: "1 month",
                link: "https://shop.quotum.cloud/products/crypto-insider",
              },
            ]}
            features={basicFeatures}
          />
          <PricingTier
            title="Advanced"
            prices={[
              {
                amount: "180",
                duration: "3 months",
                link: "https://shop.quotum.cloud/products/insider-crypto-3",
              },
              {
                amount: "330",
                duration: "6 months",
                link: "https://shop.quotum.cloud/products/6-months-vip",
              },
            ]}
            features={advancedFeatures}
            highlight
          />
        </div>
      </div>
    </div>
  );
};

export default PendingActivation;
