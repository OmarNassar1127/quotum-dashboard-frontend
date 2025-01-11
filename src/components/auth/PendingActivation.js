import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import axios from "../../lib/axios";
import OneMonth from "../../assets/OneMonth.webp";
import ThreeMonth from "../../assets/ThreeMonth.webp";
import SixMonth from "../../assets/SixMonth.webp";
import quotumVideo from "../../assets/quotum-recording.mp4";

// Subscription Card Component
const SubscriptionCard = ({
  months,
  price,
  isPopular = false,
  isBestDeal = false,
  features = [],
  image,
  onSubscribe,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-col relative transform transition-all hover:scale-105 shadow-lg">
      {isPopular && (
        <span className="absolute -top-3 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          Most Popular
        </span>
      )}
      {isBestDeal && (
        <span className="absolute -top-3 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          Best Value
        </span>
      )}
      <div className="flex flex-col h-full">
        <img
          src={image}
          alt={`${months}-month subscription`}
          className="w-full h-24 object-cover rounded-lg mb-4"
        />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {months} MONTHS
        </h3>
        <ul className="text-gray-700 space-y-1 text-sm mb-4 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <p className="text-2xl font-bold text-gray-900 mb-3">€{price}</p>
          <button
            onClick={() =>
              onSubscribe(`${months}month${months > 1 ? "s" : ""}`)
            }
            disabled={isLoading}
            className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? "Processing..." : "SELECT PLAN"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const PendingActivation = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("active");
      navigate("/login", { replace: true });
    }
  };

  const createCheckoutSession = async (planIdentifier) => {
    setLoadingPlan(planIdentifier);
    try {
      const response = await axios.post("/create-checkout-session", {
        plan: planIdentifier,
      });
      const { checkoutUrl } = response.data;
      if (response.status === 200 && checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to initialize payment. Please try again.");
      setLoadingPlan(null);
    }
  };

  const basicFeatures = [
    "Step-by-Step Video Tutorials",
    "Weekly Market Updates",
    "VIP Telegram Channel",
  ];

  const advancedFeatures = [
    "Full Basic Package",
    "Market Exit Signals",
    "1-on-1 Support",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Video Section */}
      <section className="relative bg-gray-100 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome to <span className="text-orange-600">Quotum VIP</span>
              </h1>
              <p className="text-xl text-gray-700">
                You're just one step away from joining our elite community of
                successful traders.
              </p>
              <div className="flex items-start gap-3">
                <div className="p-1 mt-1 bg-green-100 rounded">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-700">
                  Your account is under review. Complete your subscription below
                  to gain instant access.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() =>
                    window.open("https://wa.me/31621573027", "_blank")
                  }
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium group gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:bg-gray-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>

            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
              <video
                className="w-full h-full object-cover opacity-90"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={quotumVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SubscriptionCard
              months={1}
              price={75}
              image={OneMonth}
              features={basicFeatures}
              onSubscribe={createCheckoutSession}
              isLoading={loadingPlan === "1month"}
            />
            <SubscriptionCard
              months={3}
              price={180}
              isPopular={true}
              image={ThreeMonth}
              features={advancedFeatures}
              onSubscribe={createCheckoutSession}
              isLoading={loadingPlan === "3months"}
            />
            <SubscriptionCard
              months={6}
              price={330}
              isBestDeal={true}
              image={SixMonth}
              features={advancedFeatures}
              onSubscribe={createCheckoutSession}
              isLoading={loadingPlan === "6months"}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PendingActivation;
