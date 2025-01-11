import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, AlertCircle, ChevronLeft, X } from "lucide-react";
import axios from "../../lib/axios";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef(null);
  const [expandedImageUrl, setExpandedImageUrl] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      const postData = response.data.data;
      setPost(postData);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError(err.response?.data?.error || "Failed to load post details.");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111] text-white">
        <Loader className="w-6 h-6 mr-2 animate-spin text-gray-300" />
        <span className="text-gray-300">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111] text-red-300">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111] text-gray-300">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Post not found</span>
      </div>
    );
  }

  const getMediaUrl = (content) => {
    if (content.type === "image" && content.url) {
      return content.url.replace(/\/\/storage/, "/storage");
    }
    return null;
  };

  const handleImageClick = (url) => {
    setExpandedImageUrl(url);
  };

  const closeExpandedImage = () => {
    setExpandedImageUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white min-h-screen">
      <div className="bg-[#222] border border-[#333] rounded-xl shadow-md">
        {/* Header Section */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 px-4 sm:px-6 ${
            isScrolled ? "sticky top-0 bg-[#222] py-2 z-10 shadow-md" : "py-4"
          }`}
        >
          <button
            onClick={() => navigate(`/dashboard/coin/${post.coin?.coingecko_id}`)}
            className="flex items-center space-x-2 text-sm sm:text-base font-medium text-gray-200 bg-[#333] px-3 py-2 rounded-lg hover:bg-[#444] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div
            className={`font-semibold text-gray-100 transition-all duration-300 mt-2 sm:mt-0 sm:ml-4 ${
              isScrolled
                ? "text-base sm:text-lg md:text-xl opacity-100"
                : "opacity-0 text-lg sm:text-xl md:text-2xl"
            }`}
          >
            {post.title}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-6 pt-0 pb-6" ref={contentRef}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 mt-4 text-gray-100">
            {post.title}
          </h1>

          <div className="prose max-w-none text-gray-200">
            {post.content.map((block, index) => (
              <div key={index} className="mb-4">
                {block.type === "text" && (
                  <p className="leading-relaxed text-gray-300">
                    {block.content}
                  </p>
                )}
                {block.type === "image" && getMediaUrl(block) && (
                  <div className="my-8 cursor-zoom-in">
                    <img
                      src={getMediaUrl(block)}
                      alt={`Content for ${post.title}`}
                      className="w-full rounded-lg object-contain shadow-lg"
                      loading="lazy"
                      onClick={() => handleImageClick(getMediaUrl(block))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional metadata */}
          {post.created_at && (
            <div className="mt-8 pt-4 border-t border-[#333] text-sm text-gray-400">
              Posted on {new Date(post.created_at).toLocaleDateString()}
              {post.coin && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-medium text-gray-300">
                    {post.coin.name}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeExpandedImage}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-colors"
              onClick={closeExpandedImage}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={expandedImageUrl}
              alt="Expanded"
              className="max-w-full max-h-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
