import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  const animationUrl =
    "https://assets2.lottiefiles.com/packages/lf20_fcfjwiyb.json";

  useEffect(() => {
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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white p-4 md:p-6">
      <div className="w-full max-w-4xl bg-white bg-opacity-10 rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 backdrop-blur-sm">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Left Section: Animation and Title */}
          <div className="text-center md:border-r md:border-white md:border-opacity-20">
            {animationLoaded ? (
              <Lottie
                animationData={animationData}
                loop={false}
                className="w-48 h-48 md:w-56 md:h-56 mx-auto"
              />
            ) : (
              <div className="h-48 md:h-56 flex items-center justify-center">
                <p className="text-lg">Loading animation...</p>
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg md:text-xl text-white text-opacity-90 mb-4">
              Thank you for your payment. Your subscription is now active!
            </p>
          </div>

          {/* Right Section: Email Info and Button */}
          <div className="space-y-6">
            <div className="bg-white bg-opacity-20 rounded-xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Looking for your confirmation email?
              </h2>
              <ul className="space-y-3 text-base md:text-lg">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Please check your email inbox for a message from Quotum
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    If you don't see it, please check your Spam/Junk folder
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    The email contains important information about your
                    subscription
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="space-y-1">
                    <div>Subject line:</div>
                    <div>"Quotum - Your Subscription is Active"</div>
                    <div className="text-white text-opacity-75">or</div>
                    <div>"Quotum - Your Subscription is Now Active"</div>
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-6 py-3 bg-white text-green-600 text-lg font-semibold rounded-xl shadow-lg hover:bg-green-50 transition-all duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
