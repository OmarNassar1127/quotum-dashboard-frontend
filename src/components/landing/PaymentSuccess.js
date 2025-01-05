import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  // Lottie animation URL
  const animationUrl =
    "https://assets2.lottiefiles.com/packages/lf20_fcfjwiyb.json";

  useEffect(() => {
    // Load animation data safely
    const loadAnimationData = async () => {
      try {
        const response = await fetch(animationUrl);
        const data = await response.json();

        if (data.layers && data.layers.length > 0) {
          setAnimationData(data);
          setAnimationLoaded(true);
        } else {
          console.error("Animation data is invalid");
        }
      } catch (error) {
        console.error("Error loading animation:", error);
      }
    };

    loadAnimationData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => navigate("/dashboard"), 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-300 via-green-400 to-green-500 text-white">
      {/* Lottie Animation */}
      {animationLoaded ? (
        <Lottie
          animationData={animationData}
          loop={false}
          className="w-80 h-80 mb-8"
        />
      ) : (
        <div className="text-center">
          <p>Loading animation...</p>
        </div>
      )}

      {/* Success Message */}
      <h1 className="text-4xl font-extrabold mb-4">Payment Successful!</h1>
      <p className="text-lg mb-6">
        Thank you for your payment. Your subscription is now active!
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-white text-green-700 text-lg font-semibold rounded-lg shadow-md hover:bg-green-100 transition-all"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;
