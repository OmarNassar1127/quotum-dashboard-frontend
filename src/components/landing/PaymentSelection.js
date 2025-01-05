import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../lib/axios";
import quotumLogo from "../../assets/quotum-no-bg.png";

const PaymentSelection = () => {
  const { plan } = useParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/create-checkout-session", {
        plan,
      });

      const { checkoutUrl } = response.data;

      if (response.status === 200 && checkoutUrl) {
        window.location.href = checkoutUrl; // Redirect to Stripe-hosted checkout
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#111] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img
                src={quotumLogo}
                alt="Quotum Logo"
                className="h-14 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
              <span className="text-white text-xl ml-3 font-semibold">
                Quotum.cloud
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
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

      {/* Content Section */}
      <div className="flex items-center justify-center min-h-screen pt-24">
        <form
          onSubmit={handleContinue}
          className="max-w-2xl w-full space-y-8 bg-white shadow-md p-6 rounded-lg"
        >
          {/* Logo and Header */}
          <div className="text-center">
            <img
              src={quotumLogo}
              alt="Quotum Logo"
              className="h-20 w-auto mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-black">
              General Terms of Service
            </h2>
            <p className="text-gray-600 mt-2">
              To proceed to the payment page, you must first agree to the terms
              and conditions.
            </p>
          </div>

          {/* Terms Section */}
          <div className="space-y-4">
            {[
              {
                key: "responsibility",
                label:
                  "I understand that Quotum does not provide financial advice and that I am personally responsible for my actions within the crypto market.",
              },
              {
                key: "volatility",
                label:
                  "I understand that cryptocurrency is volatile and prices can fluctuate greatly.",
              },
              {
                key: "rules",
                label:
                  "I understand that there are rules within the Quotum Community that must be followed to avoid being banned.",
              },
              {
                key: "terms",
                label: "I agree to the terms and conditions.",
              },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-start space-x-3">
                <input type="checkbox" name={key} required />
                <span className="text-black">{label}</span>
              </label>
            ))}
          </div>

          {/* Payment Method Section */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">
              Select a payment method
            </h3>
            <div className="space-y-3">
              {[
                { method: "ideal", label: "iDeal & Bancontact" },
                {
                  method: "creditcard",
                  label: "Creditcard (Visa / Mastercard)",
                },
              ].map(({ method, label }) => (
                <label
                  key={method}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                    selectedPaymentMethod === method
                      ? "border-[#FF6B00] bg-gray-100"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    className="h-5 w-5 text-[#FF6B00] focus:ring-[#FF6B00]"
                    onChange={() => handlePaymentMethodSelect(method)}
                    required
                  />
                  <span className="text-black">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors font-medium"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentSelection;
