import React, { useState, useEffect } from "react";
import { Loader, Check, ExternalLink } from "lucide-react";
import axios from "../../lib/axios";

const TelegramPage = () => {
  const [status, setStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState("init");
  const [progress, setProgress] = useState(0);
  const [telegramId, setTelegramId] = useState("@");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`/telegram/${userId}/status`);
      const data = response.data;
      setStatus(data);

      if (!data.has_telegram_id) {
        setCurrentStep("start");
      } else if (!data.has_invite_link) {
        setCurrentStep("generate");
      } else if (!data.link_used) {
        setCurrentStep("join");
      } else {
        setCurrentStep("complete");
      }
    } catch (err) {
      setError("Failed to fetch status");
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
    }, 90); // ~3s total
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
      setProgress(0);

      setCurrentStep("generate_loading");

      const spinnerPromise = new Promise((resolve) => {
        let p = 0;
        const interval = setInterval(() => {
          p += 5;
          setProgress(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      const apiPromise = axios
        .post(`/telegram/${userId}/generate-link`)
        .then(() => fetchStatus());

      await Promise.all([spinnerPromise, apiPromise]);

      setCurrentStep("join");
    } catch (err) {
      setError("Failed to generate invite link");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteLinkClick = async () => {
    try {
      await axios.post(`/telegram/${userId}/link-clicked`);
      window.open(status.telegram_invite_link, "_blank");
    } catch (err) {
      console.error("Failed to update link click status", err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "start":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
              Join Our Telegram Community
            </h2>
            <p className="text-gray-300">Ready to get your invite link?</p>
            <button
              onClick={startJourney}
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
            >
              Start Journey
            </button>
          </div>
        );

      case "loading": {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = (1 - progress / 100) * circumference;

        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[200px]">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500 transition-all duration-300 ease-linear"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <text
                  x="50%"
                  y="50%"
                  dy=".35em"
                  textAnchor="middle"
                  className="fill-current text-white text-2xl font-bold"
                >
                  {progress}%
                </text>
              </svg>
            </div>
            <p className="text-gray-200 text-lg">Loading your journey...</p>
          </div>
        );
      }

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
            <h2 className="text-2xl font-bold text-purple-300">
              Generate Your Invite Link
            </h2>
            <p className="text-gray-300">
              Click below to get a one-time use invite link
            </p>
            <button
              onClick={generateInviteLink}
              disabled={loading}
              className="relative px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 transform hover:scale-105 shadow-xl"
            >
              {loading ? (
                <Loader className="animate-spin mx-auto h-5 w-5" />
              ) : (
                "Generate Link"
              )}
            </button>
          </div>
        );

      case "generate_loading": {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = (1 - progress / 100) * circumference;

        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[200px]">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-purple-500 transition-all duration-300 ease-linear"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <text
                  x="50%"
                  y="50%"
                  dy=".35em"
                  textAnchor="middle"
                  className="fill-current text-white text-2xl font-bold"
                >
                  {progress}%
                </text>
              </svg>
            </div>
            <p className="text-gray-200 text-lg">Generating your link...</p>
          </div>
        );
      }

      case "join":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-white">Join Our Group</h2>
            <p className="text-gray-300">
              Your exclusive invite link is ready!
            </p>
            <div className="max-w-md mx-auto p-4 bg-[#222] rounded-lg border border-[#333]">
              <button
                onClick={handleInviteLinkClick}
                className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 mx-auto"
              >
                Click to join the group <ExternalLink className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              This link can only be used once and is exclusive to you
            </p>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-600/30 rounded-full p-4 relative animate-magic-swell">
                <Check className="h-10 w-10 text-green-400 z-10 relative animate-swirl" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-green-400 drop-shadow-md">
              You're All Set!
            </h2>
            <p className="text-gray-300">Welcome to our Telegram community!</p>
            <img
              src="https://media.giphy.com/media/QBd2kLB5qDmysEXre9/giphy.gif"
              alt="Success"
              className="mx-auto rounded-lg w-48"
            />
            <button
              onClick={handleInviteLinkClick}
              className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 mx-auto mt-4"
            >
              Click to join the group <ExternalLink className="h-5 w-5" />
            </button>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin mx-auto h-8 w-8 text-gray-300" />
          </div>
        );
    }
  };

  return (
    <div
      className="relative p-6 text-white overflow-hidden
                 bg-gradient-to-br from-[#181818] via-[#111] to-[#181818]"
    >
      <style>{`
        body {
          background-color: #0f0f0f;
        }
        .stars {
          position: absolute;
          width: 2000px;
          height: 2000px;
          background: transparent url("https://raw.githubusercontent.com/ProGamerGov/pixel-editor-drawings/main/stars.png") repeat;
          animation: twinkle 90s linear infinite;
          pointer-events: none;
          top: -500px;
          left: -500px;
        }
        @keyframes twinkle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes swirl {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .animate-swirl {
          animation: swirl 2s infinite ease-in-out;
        }
        @keyframes magicSwell {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        .animate-magic-swell {
          animation: magicSwell 3s infinite;
        }
      `}</style>

      <div className="stars" />

      <div className="absolute w-72 h-72 bg-purple-600 rounded-full top-[-4rem] left-[-8rem] opacity-20 blur-2xl animate-float-slow" />
      <div className="absolute w-80 h-80 bg-blue-600 rounded-full bottom-[-8rem] right-[-8rem] opacity-20 blur-2xl animate-float-slower" />

      <div className="max-w-xl mx-auto mt-12 relative z-10">
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
