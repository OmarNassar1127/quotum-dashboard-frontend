import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, AlertCircle, ChevronLeft } from "lucide-react";
import axios from "../../lib/axios";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef(null);

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

  const handleScroll = (e) => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white min-h-screen">
      <div className="bg-[#222] border border-[#333] rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div
          className={`flex items-center justify-between transition-all duration-300 px-6 ${
            isScrolled ? "sticky top-0 bg-[#222] py-2 z-10 shadow-md" : "py-4"
          }`}
        >
          <div className="mb-4">
            <button
              onClick={() => navigate(`/coin/${post.coin?.coingecko_id}`)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-200 bg-[#333] px-3 py-2 rounded-lg hover:bg-[#444] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          </div>
          <div
            className={`text-lg font-semibold text-gray-100 transition-all duration-300 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            {post.title}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 pt-0 pb-6" ref={contentRef}>
          <h1 className="text-3xl font-bold mb-6 mt-4 text-gray-100">
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
                  <div className="my-8">
                    <img
                      src={getMediaUrl(block)}
                      alt={`Content for ${post.title}`}
                      className="w-full rounded-lg object-contain shadow-lg"
                      loading="lazy"
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
    </div>
  );
};

export default PostDetail;
