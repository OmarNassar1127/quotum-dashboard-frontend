import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  // Lottie animation URL
  const animationUrl =
    "https://assets8.lottiefiles.com/private_files/lf30_bqnbgdhf.json";

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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-300 via-red-400 to-red-500 text-white">
      {/* Lottie Animation */}
      {animationLoaded ? (
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-80 h-80 mb-8"
        />
      ) : (
        <div className="text-center">
          <p>Loading animation...</p>
        </div>
      )}

      {/* Cancel Message */}
      <h1 className="text-4xl font-extrabold mb-4">Payment Cancelled!</h1>
      <p className="text-lg mb-6">
        Your payment was not completed. You can try again or contact support if
        you need help.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/payment-selection")}
        className="px-6 py-3 bg-white text-red-700 text-lg font-semibold rounded-lg shadow-md hover:bg-red-100 transition-all"
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentCancel;
