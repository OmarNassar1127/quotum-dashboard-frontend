import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import quotumLogo from "../../assets/quotum-no-bg.png";

// Load Stripe
const stripePromise = loadStripe(
  // "pk_live_51QdstOIcr5cxrEYnLU3maByI1Uwqa6XbiMfDGvOb1HexlxKV6gEk9pCaLQRev8dCbCep1I3dY3TlL7cdq0gA9Ya000eZtT1e7J"
  "pk_test_51QdstOIcr5cxrEYnzqUwrI1SAIj5DcjCtBA7QJ4RKCwi5o2qlxuuWlECwI4eCuJNjVpNIVvJZZibZzxsgdLnyCUv00tb0oefsk"
);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const clientSecret = state?.clientSecret;

  useEffect(() => {
    if (!clientSecret) {
      navigate("/");
    }
  }, [clientSecret, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements) {
      setLoading(false);
      setErrorMessage("Stripe has not yet loaded. Please try again.");
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000",
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment.");
      } else if (paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
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

      {/* Payment Form */}
      <div className="flex items-center justify-center min-h-screen pt-24">
        <div className="max-w-md w-full bg-white shadow-md p-6 rounded-lg">
          <div className="text-center mb-6">
            <img
              src={quotumLogo}
              alt="Quotum Logo"
              className="h-20 w-auto mx-auto"
            />
            <h2 className="text-3xl font-bold text-black">
              {paymentSuccess ? "Payment Successful" : "Complete Payment"}
            </h2>
          </div>

          {paymentSuccess ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Thank you for your payment! Your subscription is now active.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <PaymentElement />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors font-medium mt-6"
                  disabled={!stripe || loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the PaymentForm with Stripe's Elements provider
const PaymentFormWrapper = () => {
  const { state } = useLocation(); // Get the clientSecret from the state
  const clientSecret = state?.clientSecret;

  if (!clientSecret) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm />
    </Elements>
  );
};

export default PaymentFormWrapper;
