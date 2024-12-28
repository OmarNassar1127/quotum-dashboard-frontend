import React, { useState, useEffect } from "react";
import {
  Plus,
  ImageIcon,
  Loader,
  AlertCircle,
  Type,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "../../lib/axios";
import ContentBlock from "./ContentBlock";
import PostsList from "./PostsList";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
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
        {
          id: crypto.randomUUID(),
          type: type,
          content: type === "text" ? "" : "",
          file: null,
          url: "",
        },
      ],
    }));
  };

  const updateContentBlock = (index, updatedBlock) => {
    const newContent = [...formData.content];
    newContent[index] = updatedBlock;
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const deleteContentBlock = (index) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("coin_id", formData.coin_id);
      formDataToSend.append("status", formData.status);

      const processedContent = [];
      let imageCount = 0;

      for (const block of formData.content) {
        if (block.type === "text") {
          processedContent.push({ type: "text", content: block.content });
        } else if (block.type === "image") {
          if (block.file) {
            formDataToSend.append(`images[${imageCount}]`, block.file);
            processedContent.push({ type: "image", index: imageCount });
            imageCount++;
          } else if (block.url) {
            processedContent.push({ type: "image", url: block.url });
          }
        }
      }

      formDataToSend.append("content", JSON.stringify(processedContent));

      if (editingPost) {
        formDataToSend.append("_method", "PUT");
        try {
          await axios.post(`/posts/${editingPost.id}`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error("Update error:", error);
          // Even if we get an error response, check if the update succeeded
          await fetchData(pagination.current_page);
          const updatedPost = (await axios.get(`/posts/${editingPost.id}`))
            .data;
          if (updatedPost && updatedPost.title === formData.title) {
            resetForm();
            return;
          }
          throw error;
        }
      } else {
        await axios.post("/posts", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      resetForm();
      await fetchData(pagination.current_page);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (editingPost ? "Failed to update post." : "Failed to create post.");
      setError(errorMessage);
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

  const handleStatusChange = async (postId, status) => {
    try {
      await axios.patch(`/posts/${postId}/status`, {
        status: status,
      });
      await fetchData(pagination.current_page);
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const startEditing = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content.map((block) => ({
        ...block,
        id: crypto.randomUUID(),
      })),
      coin_id: post.coin_id,
      status: post.status,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({
      title: "",
      content: [],
      coin_id: "",
      status: "draft",
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchData(newPage);
    }
  };

  if (loading && !showForm) {
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
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Post
          </button>
        )}
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
            {editingPost ? "Edit Post" : "Create New Post"}
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
                    key={block.id || index}
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
                onClick={resetForm}
                className="px-4 py-2 border border-[#333] text-gray-200 bg-[#222] rounded-lg hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingPost ? "Save Changes" : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      )}

      <PostsList
        posts={posts}
        coins={coins}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onEdit={startEditing}
      />

      {pagination.total > pagination.per_page && (
        <div className="flex items-center justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="p-2 rounded-lg border border-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2">
            {[...Array(pagination.last_page)].map((_, index) => {
              const page = index + 1;
              const isActive = page === pagination.current_page;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg border ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-[#333] hover:bg-[#333] transition-colors"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
            className="p-2 rounded-lg border border-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333] transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <span className="text-sm text-gray-400 ml-4">
            Total: {pagination.total} posts
          </span>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
