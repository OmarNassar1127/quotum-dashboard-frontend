import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../lib/axios";
import quotumLogo from "../../assets/quotum-no-bg.png";
import { Shield, LineChart, PieChart } from "lucide-react";
import quotumVideo from "../../assets/quotum-recording.mp4";

const PaymentSelection = () => {
  const { plan } = useParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Secure Tracking",
      description: "Enterprise-grade security protocols",
    },
    {
      icon: <LineChart className="w-8 h-8 text-blue-500" />,
      title: "Trend Analysis",
      description: "Real-time position monitoring",
    },
    {
      icon: <PieChart className="w-8 h-8 text-purple-500" />,
      title: "Portfolio Insights",
      description: "Comprehensive liquidity tracking",
    },
  ];

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_title: "Payment Selection",
        page_path: `/payment/${plan}`,
      });
    }
  }, [plan]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!plan) {
      alert("Invalid subscription plan. Please select a valid plan.");
      navigate("/");
      return;
    }
    if (!selectedPaymentMethod || !agreedToTerms) {
      alert("Please select a payment method and agree to the terms.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/create-checkout-session", { plan });
      const { checkoutUrl } = response.data;
      if (response.status === 200 && checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#111] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center">
              <img
                src={quotumLogo}
                alt="Quotum Logo"
                className="h-10 lg:h-14 w-auto cursor-pointer hover:rotate-12 transition-transform duration-300"
                onClick={() => navigate("/")}
              />
              <span className="text-white text-lg lg:text-xl ml-3 font-semibold">
                Quotum.cloud
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Features Section - Second on mobile, first on desktop */}
          <div className="order-2 lg:order-none lg:w-1/2 flex flex-col gap-8 items-center text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What You're Unlocking
            </h2>
            {/* Video Container */}
            <div className="rounded-xl shadow-lg overflow-hidden bg-gray-800 aspect-video">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90"
              >
                <source src={quotumVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <h4 className="text-xl font-semibold text-gray-900">
              Sell-trigger page is now live 😉
            </h4>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3">{feature.icon}</div>
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section - First on mobile, second on desktop */}
          <div className="order-1 lg:order-none lg:w-1/2 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                You're Almost There!
              </h2>
              <p className="text-gray-600">
                Complete your subscription to access professional trading tools
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="mb-8">
              <label className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00] cursor-pointer flex-shrink-0"
                />
                <span className="ml-3 text-gray-700 text-sm">
                  I agree to the{" "}
                  <a
                    href="#/terms"
                    className="text-[#FF6B00] hover:text-[#ff8533] underline"
                  >
                    terms and conditions
                  </a>
                </span>
              </label>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  {
                    method: "ideal",
                    label: "iDeal & Bancontact",
                  },
                  {
                    method: "creditcard",
                    label: "Credit/Debit Card",
                  },
                ].map((method) => (
                  <label
                    key={method.method}
                    className={`
                      flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors
                      ${
                        selectedPaymentMethod === method.method
                          ? "border-[#FF6B00] bg-[#FFF5EF]"
                          : "border-gray-200 hover:border-[#FF6B00]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.method}
                      className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00]"
                      onChange={() => handlePaymentMethodSelect(method.method)}
                      required
                    />
                    <span className="ml-3 font-medium text-gray-700">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              onClick={handleContinue}
              disabled={!selectedPaymentMethod || !agreedToTerms || loading}
              className="w-full py-4 bg-[#FF6B00] text-white rounded-xl font-semibold hover:bg-[#ff8533] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </div>
              ) : (
                "Complete Subscription"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;
