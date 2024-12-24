import React from "react";
import {
  ClockIcon,
  LogOut,
  CheckCircle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
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
                €{price.amount}
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

const WhatsAppSupport = () => (
  <div className="bg-[#111] rounded-lg p-6 border border-white/20 flex flex-col h-full shadow-md shadow-white/10 ring-1 ring-white/10">
    <div className="flex flex-col h-full">
      <div className="rounded-full bg-[#25D366] p-3 self-start">
        <MessageCircle className="h-8 w-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-white mt-4 mb-2">Need Support?</h3>

      <p className="text-gray-300 mb-6 flex-grow">
        Have questions or need assistance? Our support team is available 24/7
        via WhatsApp. Don't hesitate to reach out!
      </p>

      <button
        onClick={() => window.open("https://wa.me/31621573027", "_blank")}
        className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA56] transition-colors duration-200 text-sm font-medium group"
      >
        Contact via WhatsApp
        <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
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
    "1-on-1 direct support",
    "Month 2 Upgrade",
  ];

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status Card */}
          <div className="bg-[#111] rounded-lg p-6 border border-white/20 flex flex-col shadow-md shadow-white/10 ring-1 ring-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-green-200 p-3">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white">Account Status</h2>
            </div>

            <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                Your account is currently under review by an administrator. Once
                activated, you will be notified via email.
              </p>
            </div>

            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-black bg-[#32CD32] hover:bg-[#57e357] focus:outline-none focus:ring-2 focus:ring-[#32CD32] focus:ring-offset-2 transition-all"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
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

          {/* WhatsApp Support Card */}
          <WhatsAppSupport />
        </div>
      </div>
    </div>
  );
};

export default PendingActivation;
