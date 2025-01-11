import React, { useState, useEffect } from "react";
import {
  Loader,
  Clock,
  Users,
  Link as LinkIcon,
  ChevronRight,
} from "lucide-react";
import axios from "../../lib/axios";
import ChangePassword from "../user/ChangePassword";

const ProfilePage = () => {
  const [stats, setStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchSubscription();
  }, []);

  useEffect(() => {
    if (subscription?.end_date) {
      const timer = setInterval(() => {
        const end = new Date(subscription.end_date).getTime();
        const now = new Date().getTime();
        const difference = end - now;

        if (difference <= 0) {
          clearInterval(timer);
          setTimeLeft(null);
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [subscription]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/referral/stats");
      setStats(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await axios.get("/user-subscription");
      setSubscription(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateCode = async () => {
    try {
      await axios.post("/referral/generate");
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const copyLink = () => {
    if (!stats?.code) return;
    const referralLink = `${window.location.origin}/#/register?ref=${stats.code}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center bg-[#111] p-3 rounded-lg">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#111]">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Change Password
          </button>
        </div>

        {/* Change Password Modal */}
        <ChangePassword
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Card */}
          <div className="lg:col-span-2 bg-[#222] border border-[#333] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Subscription Status
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  subscription
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {subscription ? "Active" : "Inactive"}
              </span>
            </div>

            {subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-medium">{subscription.plan_name}</span>
                </div>

                {timeLeft && (
                  <div className="mt-4">
                    <p className="text-gray-400 mb-3">Time until expiration</p>
                    <div className="grid grid-cols-4 gap-3">
                      <TimeBlock value={timeLeft.days} label="Days" />
                      <TimeBlock value={timeLeft.hours} label="Hours" />
                      <TimeBlock value={timeLeft.minutes} label="Minutes" />
                      <TimeBlock value={timeLeft.seconds} label="Seconds" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">
                You currently don't have an active subscription.
              </p>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-[#222] border border-[#333] rounded-xl p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-gray-400" />
              Referral Stats
            </h2>
            <div className="flex items-center justify-between p-4 bg-[#111] rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <p className="text-3xl font-bold">
                  {stats?.total_referrals || 0}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
          {/* Referral Code Card */}
          <div className="lg:col-span-2 bg-[#222] border border-[#333] rounded-xl p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <LinkIcon className="w-5 h-5 text-gray-400" />
              Referral Link
            </h2>

            {stats?.code ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  readOnly
                  value={`${window.location.origin}/#/register?ref=${stats.code}`}
                  className="flex-1 px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={copyLink}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            ) : (
              <button
                onClick={generateCode}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate Referral Code
              </button>
            )}
          </div>

          {/* Recent Referrals Card */}
          <div className="bg-[#222] border border-[#333] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Referrals</h2>
            <div className="space-y-3">
              {stats?.recent_referrals?.length > 0 ? (
                stats.recent_referrals.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-3 bg-[#111] rounded-lg"
                  >
                    <span className="font-medium">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 bg-[#111] rounded-lg">
                  <Users className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-center">No referrals yet</p>
                  <p className="text-gray-500 text-sm text-center mt-1">
                    Share your referral link to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
