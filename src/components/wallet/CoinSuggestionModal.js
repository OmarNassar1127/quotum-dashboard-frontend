import React, { useState, useEffect } from "react";
import { Send, Loader, CheckCircle, X } from "lucide-react";
import axios from "../../lib/axios";

const CoinSuggestionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    coin_name: "",
    coingecko_link: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await axios.post("/coin-suggestions", formData);
      setStatus("success");
    } catch (error) {
      console.error("Failed to send suggestion:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to send suggestion. Please try again later."
      );
      setStatus("error");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#222] border border-[#333] rounded-xl w-full max-w-md mx-4 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#333] rounded-lg p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Suggestion Sent Successfully!
              </h3>
              <p className="text-gray-400">
                Thank you for your suggestion. Our team will add this coin in the next 3 days.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-[#333] text-gray-100 hover:bg-[#444] font-medium rounded-lg px-5 py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Suggest New Coin
              </h3>
              <p className="text-gray-400">
                Don't see the coin you're looking for? Submit a suggestion to
                add it to our system.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="coin_name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Coin Name
                </label>
                <input
                  type="text"
                  id="coin_name"
                  name="coin_name"
                  required
                  value={formData.coin_name}
                  onChange={handleChange}
                  className="w-full bg-[#333] border border-[#444] rounded-lg p-2.5 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Bitcoin"
                />
              </div>

              <div>
                <label
                  htmlFor="coingecko_link"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  CoinGecko Link
                </label>
                <input
                  type="url"
                  id="coingecko_link"
                  name="coingecko_link"
                  required
                  value={formData.coingecko_link}
                  onChange={handleChange}
                  className="w-full bg-[#333] border border-[#444] rounded-lg p-2.5 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. https://www.coingecko.com/en/coins/bitcoin"
                />
              </div>

              {status === "error" && (
                <div className="text-red-400 text-sm">{errorMessage}</div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#333] text-gray-100 hover:bg-[#444] font-medium rounded-lg px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinSuggestionModal;
