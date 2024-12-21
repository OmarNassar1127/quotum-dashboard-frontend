import React, { useState, useEffect } from "react";
import { Loader, Check, Send, ExternalLink } from "lucide-react";
import axios from "../../lib/axios";

const TelegramPage = () => {
  const [status, setStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState("init");
  const [progress, setProgress] = useState(0);
  const [telegramId, setTelegramId] = useState("@");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("user_id"); // Assuming `user_id` is stored on login

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`/telegram/${userId}/status`);
      setStatus(response.data);
      if (!response.data.has_telegram_id) {
        setCurrentStep("start");
      } else if (!response.data.has_invite_link) {
        setCurrentStep("generate");
      } else if (!response.data.link_used) {
        setCurrentStep("join");
      } else {
        setCurrentStep("complete");
      }
    } catch (err) {
      setError("Failed to fetch status");
    }
  };

  const handleTelegramIdSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(`/telegram/${userId}/save-id`, {
        telegram_user_id: telegramId,
      });
      setCurrentStep("generate");
    } catch (err) {
      setError("Failed to save Telegram ID");
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/telegram/${userId}/generate-link`);
      await fetchStatus();
      setCurrentStep("join");
    } catch (err) {
      setError("Failed to generate invite link");
    } finally {
      setLoading(false);
    }
  };

  const startJourney = () => {
    setCurrentStep("loading");
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 3;
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setCurrentStep("telegram_id");
      }
    }, 90); // Will take 3 seconds to complete
  };

  const handleInviteLinkClick = async () => {
    try {
      await axios.post(`/telegram/${userId}/link-clicked`);
      window.open(status.telegram_invite_link, "_blank");
    } catch (error) {
      console.error("Failed to update link click status", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "start":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Join Our Telegram Community</h2>
            <p className="text-gray-400">
              Start the process to get your exclusive invite link
            </p>
            <button
              onClick={startJourney}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Journey
            </button>
          </div>
        );
      case "loading":
        return (
          <div className="space-y-4">
            <div className="h-2 bg-[#222] rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-gray-400">
              Preparing your journey...
            </p>
          </div>
        );
      case "telegram_id":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Enter Your Telegram Username
            </h2>
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="w-full px-4 py-2 bg-[#222] border border-[#333] rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="@yourusername"
              />
              <button
                onClick={handleTelegramIdSubmit}
                disabled={loading || telegramId === "@"}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="animate-spin mx-auto h-5 w-5" />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        );
      case "generate":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Generate Your Invite Link</h2>
            <p className="text-gray-400">
              Click below to generate your exclusive one-time use invite link
            </p>
            <button
              onClick={generateInviteLink}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader className="animate-spin mx-auto h-5 w-5" />
              ) : (
                "Generate Link"
              )}
            </button>
          </div>
        );
      case "join":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Join Our Group</h2>
            <p className="text-gray-400">
              Your exclusive invite link is ready!
            </p>
            <div className="max-w-md mx-auto p-4 bg-[#222] rounded-lg border border-[#333]">
              <a
                href={status?.telegram_invite_link}
                onClick={handleInviteLinkClick}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300"
              >
                Click to join the group <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              This link can only be used once and is exclusive to you
            </p>
          </div>
        );
      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/20 p-3">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">You're All Set!</h2>
            <p className="text-gray-400">
              You've successfully joined our Telegram community
            </p>
          </div>
        );
      default:
        return (
          <Loader className="animate-spin mx-auto h-8 w-8 text-gray-300" />
        );
    }
  };

  return (
    <div className="p-6 bg-[#111] border border-[#222] min-h-screen text-white">
      <div className="max-w-2xl mx-auto mt-12">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default TelegramPage;
