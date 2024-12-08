import React, { useState, useEffect } from "react";
import {
  Plus,
  ImageIcon,
  Loader,
  AlertCircle,
  X,
  Calendar,
  Type,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import axios from "../../lib/axios";

// Helper function to fix image URLs
const fixImageUrl = (url) => {
  if (!url) return url;
  return url.replace(/(https?:\/\/)\/+/g, "$1").replace(/([^:]\/)\/+/g, "$1");
};

const ContentBlock = ({ block, index, onChange, onDelete }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handlePaste = (e) => {
    const item = e.clipboardData.items[0];
    if (item && item.type && item.type.indexOf("image") === 0) {
      const file = item.getAsFile();
      onChange(index, { ...block, file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (block.type === "text") {
    return (
      <div className="flex items-start space-x-4">
        <textarea
          value={block.content}
          onChange={(e) =>
            onChange(index, { ...block, content: e.target.value })
          }
          className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="p-1 hover:bg-[#333] rounded-full"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
        </button>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="flex items-center space-x-4">
        {block.url ? (
          <img
            src={fixImageUrl(block.url)}
            alt={`Image ${index}`}
            className="w-24 h-24 object-cover rounded-lg border border-[#333]"
          />
        ) : (
          <div className="relative mb-4 flex-1">
            <div className="w-full border-2 border-dashed border-[#333] rounded-lg p-2 bg-[#111]">
              <input
                type="text"
                placeholder="Paste image here"
                onPaste={handlePaste}
                className="w-full px-3 py-2 text-gray-400 bg-transparent focus:outline-none"
                disabled
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Pasted image preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="p-1 hover:bg-[#333] rounded-full"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
        </button>
      </div>
    );
  }

  return null;
};

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1,
  });
  const [formData, setFormData] = useState({
    title: "",
    content: [],
    coin_id: "",
    status: "draft",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const [postsResponse, coinsResponse] = await Promise.all([
        axios.get(`/posts?page=${page}`),
        axios.get("/coins"),
      ]);

      setPosts(postsResponse.data.data);
      setPagination({
        current_page: postsResponse.data.current_page,
        total: postsResponse.data.total,
        per_page: postsResponse.data.per_page,
        last_page: postsResponse.data.last_page,
      });
      setCoins(coinsResponse.data);
      setError(null);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addContentBlock = (type) => {
    setFormData((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        type === "text"
          ? { type: "text", content: "" }
          : { type: "image", url: "" },
      ],
    }));
  };

  const updateContentBlock = (index, updatedBlock) => {
    const newContent = [...formData.content];
    newContent[index] = updatedBlock;
    setFormData((prev) => ({
      ...prev,
      content: newContent,
    }));
  };

  const deleteContentBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("coin_id", formData.coin_id);
      formDataToSend.append("status", formData.status);

      const processedContent = await Promise.all(
        formData.content.map(async (block, index) => {
          if (block.type === "text") {
            return {
              type: "text",
              content: block.content,
            };
          } else if (block.type === "image") {
            if (block.file) {
              formDataToSend.append(`images[${index}]`, block.file);
              return {
                type: "image",
                index: index,
              };
            } else if (block.url) {
              return {
                type: "image",
                url: block.url,
              };
            }
          }
        })
      );

      formDataToSend.append("content", JSON.stringify(processedContent));

      await axios.post("/posts", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        title: "",
        content: [],
        coin_id: "",
        status: "draft",
      });
      setShowForm(false);
      await fetchData(pagination.current_page);
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        await axios.delete(`/posts/${postId}`);
        await fetchData(pagination.current_page);
      } catch (err) {
        setError("Failed to delete post. Please try again.");
        console.error("Error deleting post:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderPostContent = (post) => (
    <div className="space-y-4">
      {post.content.map((block, index) => (
        <div key={index}>
          {block.type === "text" ? (
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {block.content}
            </p>
          ) : (
            block.type === "image" &&
            block.url && (
              <div className="relative h-48 w-full">
                <img
                  src={fixImageUrl(block.url)}
                  alt={`Content for ${post.title}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111] text-white">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#111] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Post Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Post
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-300 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-[#222] border border-[#333] rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">
            Create New Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Related Coin
              </label>
              <select
                value={formData.coin_id}
                onChange={(e) =>
                  setFormData({ ...formData, coin_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a coin</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-300">
                  Content Blocks
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => addContentBlock("text")}
                    className="px-3 py-2 bg-[#333] text-gray-200 rounded-lg hover:bg-[#444] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Add Text
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock("image")}
                    className="px-3 py-2 bg-[#333] text-gray-200 rounded-lg hover:bg-[#444] flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Image
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {formData.content.map((block, index) => (
                  <ContentBlock
                    key={index}
                    block={block}
                    index={index}
                    onChange={updateContentBlock}
                    onDelete={deleteContentBlock}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#333] rounded-lg bg-[#111] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    title: "",
                    content: [],
                    coin_id: "",
                    status: "draft",
                  });
                }}
                className="px-4 py-2 border border-[#333] text-gray-200 bg-[#222] rounded-lg hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#222] border border-[#333] rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a]">
              <div className="flex items-center space-x-3">
                <select
                  value={post.status}
                  onChange={async (e) => {
                    try {
                      await axios.patch(`/posts/${post.id}/status`, {
                        status: e.target.value,
                      });
                      await fetchData(pagination.current_page);
                    } catch (err) {
                      setError("Failed to update status.");
                    }
                  }}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full 
                    ${
                      post.status === "published"
                        ? "bg-green-800 text-green-200"
                        : "bg-yellow-800 text-yellow-200"
                    } cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <span className="text-xs text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-1 hover:bg-[#333] rounded-full"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-100 truncate">
                  {post.title}
                </h3>
                <span className="text-sm text-gray-400">
                  {coins.find((coin) => coin.id === post.coin_id)?.name}
                </span>
              </div>

              <div className="relative">
                <div className="h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#222]">
                  {renderPostContent(post)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.last_page > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-[#333] bg-[#222] px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => fetchData(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                ${
                  pagination.current_page === 1
                    ? "bg-[#333] text-gray-400 cursor-not-allowed"
                    : "bg-[#222] text-gray-200 hover:bg-[#333]"
                }`}
            >
              Previous
            </button>
            <button
              onClick={() => fetchData(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                ${
                  pagination.current_page === pagination.last_page
                    ? "bg-[#333] text-gray-400 cursor-not-allowed"
                    : "bg-[#222] text-gray-200 hover:bg-[#333]"
                }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between text-gray-200">
            <div>
              <p className="text-sm">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.current_page - 1) * pagination.per_page + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.current_page * pagination.per_page,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => fetchData(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2
                    ${
                      pagination.current_page === 1
                        ? "bg-[#333] text-gray-400 cursor-not-allowed"
                        : "bg-[#222] text-gray-200 hover:bg-[#333]"
                    }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {[...Array(pagination.last_page)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.last_page ||
                    (page >= pagination.current_page - 1 &&
                      page <= pagination.current_page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => fetchData(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium
                          ${
                            pagination.current_page === page
                              ? "z-10 bg-blue-600 text-white"
                              : "bg-[#222] text-gray-200 hover:bg-[#333]"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (
                    page === pagination.current_page - 2 ||
                    page === pagination.current_page + 2
                  ) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => fetchData(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2
                    ${
                      pagination.current_page === pagination.last_page
                        ? "bg-[#333] text-gray-400 cursor-not-allowed"
                        : "bg-[#222] text-gray-200 hover:bg-[#333]"
                    }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
