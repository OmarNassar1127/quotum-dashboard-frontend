import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Loader,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  X,
  Group,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import axios from "../../lib/axios";
import BitcoinChartCard from "../btc-monthly/BitcoinMonthlyChart";
import BitcoinMonthlyRsiChart from "../btc-monthly/BitcoinMonthlyRsiChart";
import BitcoinRainbowChart from "../btc-monthly/BitcoinRainbowChart";
import AltcoinSeasonChart from "../altcoins/AltcoinSeasonChart";
import NUPLIndicator from "../onchain/BitcoinNUPL";
import AppRankingCards from "../app-rankings/AppRankingCards";
import FeatureRestricted from "../restricted/FeatureRestricted";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentPosts, setRecentPosts] = useState([]);
  const [bitcoinData, setBitcoinData] = useState([]);
  const [bitcoinWeeklyData, setbitcoinWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartError, setChartError] = useState(null);
  const [currentMonthColor, setCurrentMonthColor] = useState("#0000ff");
  const [currentMonthOpen, setCurrentMonthOpen] = useState(0);

  // NEW: Telegram link usage
  const [telegramLinkUsed, setTelegramLinkUsed] = useState(true); // Assume true until fetched
  // NEW: Show/hide the toast in this session
  const [showTelegramToast, setShowTelegramToast] = useState(false);

  useEffect(() => {
    fetchRecentPosts();
    fetchBitcoinData();
    fetchBitcoinWeeklyData();

    // Check Telegram status after mount
    fetchTelegramStatus();
  }, []);

  const fetchTelegramStatus = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return; // no user => no check

      const response = await axios.get(`/telegram/${userId}/status`);
      const { link_used } = response.data;
      setTelegramLinkUsed(link_used);

      if (!link_used) {
        setShowTelegramToast(true);
      }
    } catch (err) {
      console.error("Error fetching Telegram status:", err);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/platform/recent-posts");
      setRecentPosts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load recent posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBitcoinData = async () => {
    try {
      setChartLoading(true);
      const response = await axios.get("/platform/bitcoin/monthly");
      const data = response.data.map((item) => ({
        ...item,
        date: new Date(item.month),
      }));
      setBitcoinData(data);
      setChartError(null);

      const currentDate = new Date();
      const currentMonthData = data[data.length - 1];
      const monthsUntilHalving = estimateMonthsUntilHalving(currentDate);
      setCurrentMonthColor(mapMonthsToColor(monthsUntilHalving));
      setCurrentMonthOpen(currentMonthData.open);
    } catch (err) {
      setChartError("Failed to load Bitcoin data");
      console.error("Error fetching Bitcoin data:", err);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchBitcoinWeeklyData = async () => {
    try {
      setChartLoading(true);
      const response = await axios.get("/platform/bitcoin/weekly");
      const data = response.data.map((item) => ({
        ...item,
        date: new Date(item.week),
      }));
      setbitcoinWeeklyData(data);
      setChartError(null);
    } catch (err) {
      setChartError("Failed to load Bitcoin weekly data");
      console.error("Error fetching Bitcoin weekly data:", err);
    } finally {
      setChartLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/dashboard/post/${postId}`);
  };

  const estimateMonthsUntilHalving = (currentDate) => {
    const halvingDates = [
      new Date("2012-11-28"),
      new Date("2016-07-09"),
      new Date("2020-05-11"),
      new Date("2024-04-19"),
      new Date("2028-03-19"),
    ];

    for (const date of halvingDates) {
      if (currentDate < date) {
        const delta = date - currentDate;
        return Math.floor(delta / (1000 * 60 * 60 * 24 * 30));
      }
    }
    return 0;
  };

  const mapMonthsToColor = (monthsUntilHalving) => {
    const colorDict = {
      0: "#0000ff",
      10: "#00ffff",
      20: "#00ff00",
      30: "#ffff00",
      50: "#ff0000",
    };

    const points = Object.keys(colorDict).map(Number);
    const colors = Object.values(colorDict);

    for (let i = 0; i < points.length - 1; i++) {
      if (
        monthsUntilHalving >= points[i] &&
        monthsUntilHalving < points[i + 1]
      ) {
        return colors[i];
      }
    }

    return colors[colors.length - 1];
  };

  const handleJoinTelegram = () => {
    navigate("/dashboard/telegram");
  };

  const dismissToast = () => {
    setShowTelegramToast(false);
  };

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      {!telegramLinkUsed && showTelegramToast && (
        <div
          className="
            fixed bottom-6 right-6 w-80
            bg-[#111] border border-[#222] text-white
            rounded-lg shadow-lg p-4
            animate-slide-in-right
            flex items-start gap-3
          "
          style={{ zIndex: 9999 }}
        >
          <div className="mt-1">
            <Group className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <strong>Join our Telegram!</strong> Stay updated with the latest
              news and discussions.
            </p>
            <button
              onClick={handleJoinTelegram}
              className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded"
            >
              Join Now
            </button>
          </div>
          <button
            className="ml-2 text-gray-400 hover:text-gray-200"
            onClick={dismissToast}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <AppRankingCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#222] rounded-xl shadow-sm p-6 min-h-[24rem] text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-100">
                Recent Content
              </h2>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-300" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader className="h-8 w-8 animate-spin text-gray-300" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-2">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] cursor-pointer transition-colors duration-200 gap-4"
                >
                  <div className="flex items-start sm:items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={post.coin.image}
                      alt={post.coin.name}
                      className="h-10 w-10 rounded-full flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-medium text-gray-100 truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[350px]"
                        title={post.title}
                      >
                        {post.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>{post.coin.symbol.toUpperCase()}</span>
                        <span>•</span>
                        <span className="truncate">
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none w-full sm:w-auto flex justify-between sm:justify-end items-baseline gap-2">
                      <span className="text-xs text-gray-400 sm:hidden">
                        Price:
                      </span>
                      <span className="text-sm font-medium text-gray-100">
                        $
                        {parseFloat(post.coin.current_price)
                          .toFixed(3)
                          .toLocaleString()}
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-xs ${
                        post.coin.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {post.coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      <span className="whitespace-nowrap">
                        {Math.abs(
                          post.coin.price_change_percentage_24h
                        ).toFixed(2)}
                        %
                        {post.coin.price_change_percentage_24h >= 0
                          ? " up"
                          : " down"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-100">
                Altcoin Season Index
              </h2>
            </div>
          </div>
          <AltcoinSeasonChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureRestricted feature="btc_monthly_chart">
          <div className="bg-[#111] rounded-xl shadow-sm text-white">
            <BitcoinMonthlyRsiChart
              bitcoinData={bitcoinData}
              chartError={chartError}
              chartLoading={chartLoading}
              currentMonthColor={currentMonthColor}
              estimateMonthsUntilHalving={estimateMonthsUntilHalving}
            />
          </div>
        </FeatureRestricted>

        <FeatureRestricted feature="btc_monthly_chart">
          <div className="bg-[#111] rounded-xl shadow-sm text-white">
            <BitcoinChartCard
              bitcoinData={bitcoinData}
              chartError={chartError}
              chartLoading={chartLoading}
              currentMonthOpen={currentMonthOpen}
              currentMonthColor={currentMonthColor}
              estimateMonthsUntilHalving={estimateMonthsUntilHalving}
              mapMonthsToColor={mapMonthsToColor}
            />
          </div>
        </FeatureRestricted>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className=" border border-[#222] rounded-xl shadow-sm text-white">
          <NUPLIndicator isFullPage={false} />
        </div>
        <div className="bg-[#111] rounded-xl shadow-sm text-white border border-[#222]">
          <BitcoinRainbowChart
            bitcoinData={bitcoinWeeklyData}
            chartError={chartError}
            chartLoading={chartLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
