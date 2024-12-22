import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import axios from "../../lib/axios";

const ReferralPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

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
    navigator.clipboard.writeText(
      `${window.location.origin}/register?ref=${stats.code}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-[#111] border border-[#222] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Your Referrals</h1>

      {loading ? (
        <div className="flex justify-center">
          <Loader className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Referral Code Card */}
          <div className="bg-[#222] border border-[#333] p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-100">
              Referral Code
            </h2>
            {stats?.code ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  readOnly
                  value={`${window.location.origin}/register?ref=${stats.code}`}
                  className="flex-1 px-4 py-2 border border-[#333] rounded bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            ) : (
              <button
                onClick={generateCode}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate Code
              </button>
            )}
          </div>

          {/* Grid Layout for Statistics and Referrals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistics Card */}
            <div className="bg-[#222] border border-[#333] p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-100">
                Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                <div>
                  <span className="text-sm text-gray-400">Total Referrals</span>
                  <p className="text-2xl font-bold">
                    {stats?.total_referrals || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Referrals Card */}
            {stats?.recent_referrals?.length > 0 && (
              <div className="bg-[#222] border border-[#333] p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-100">
                  Recent Referrals
                </h2>
                <div className="space-y-2">
                  {stats.recent_referrals.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center text-gray-300"
                    >
                      <span>
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralPage;
