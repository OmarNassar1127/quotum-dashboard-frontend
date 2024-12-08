import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader,
  AlertCircle,
} from "lucide-react";
import axios from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const CoinDetail = () => {
  const navigate = useNavigate();
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCoinData();
  }, [coinId]);

  useEffect(() => {
    fetchPosts();
  }, [coinId, currentPage]);

  const fetchCoinData = async () => {
    try {
      const response = await axios.get(`/platform/coins/${coinId}`);
      setCoin(response.data);
    } catch (err) {
      setError("Failed to load coin data");
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/platform/coins/${coinId}/posts?page=${currentPage}`
      );
      setPosts(response.data.data);
      setTotalPages(Math.ceil(response.data.total / response.data.per_page));
      setError(null);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (!coin) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111] text-white">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white px-4 sm:px-6 lg:px-8 py-8">
      {/* Coin Header */}
      <div className="bg-[#222] border border-[#333] rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-16 h-16 rounded-full border border-[#333]"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              {coin.name}
            </h1>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-gray-300">
              <span className="text-sm sm:text-base uppercase text-gray-400">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="text-2xl font-medium text-gray-100">
                ${parseFloat(coin.current_price).toFixed(3).toLocaleString()}
              </span>
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  coin.price_change_percentage_24h >= 0
                    ? "bg-green-800 text-green-200"
                    : "bg-red-800 text-red-200"
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
              <a
                href={coin.coingecko_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center text-sm sm:text-base"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View on CoinGecko
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-100">Latest Posts</h2>
          <button
            onClick={() => navigate("/portfolio")}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-[#222] border border-[#333] rounded-lg hover:bg-[#333] hover:text-white focus:outline-none transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Portfolio
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#222] border border-[#333] rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {post.title}
                  </h3>
                  <div className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {post.content
                      ?.find((block) => block.type === "text")
                      ?.content.substring(0, 200)}
                    ...
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between text-gray-400 text-sm">
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/post/${post.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors mt-2 sm:mt-0"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center space-x-2 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-300 hover:bg-[#333]"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-[#333]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-300 hover:bg-[#333]"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
