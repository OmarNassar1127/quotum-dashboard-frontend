import React from "react";
import { Calendar, X, Pencil, ChevronRight } from "lucide-react";
import { formatDistanceToNow, format, isSameDay } from "date-fns";

// Helper function to fix image URLs
const fixImageUrl = (url) => {
  if (!url) return url;
  return url.replace(/(https?:\/\/)\/+/g, "$1").replace(/([^:]\/)\/+/g, "$1");
};

// Helper to get first image from content
const getFirstImage = (content) => {
  if (!Array.isArray(content)) return null;
  const imageBlock = content.find(
    (block) => block.type === "image" && block.url
  );
  return imageBlock?.url || null;
};

// Helper to get preview text
const getPreviewText = (content) => {
  if (!Array.isArray(content)) return "";
  const textBlock = content.find((block) => block.type === "text");
  return textBlock ? textBlock.content.slice(0, 120) + "..." : "";
};

const PostGroup = ({
  date,
  posts,
  coins,
  onDelete,
  onStatusChange,
  onEdit,
}) => {
  if (!Array.isArray(posts)) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-300">
          {format(new Date(date), "MMMM d, yyyy")}
        </h3>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            coins={coins}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

const PostCard = ({ post, coins, onDelete, onStatusChange, onEdit }) => {
  const firstImage = getFirstImage(post?.content);
  const previewText = getPreviewText(post?.content);
  const coin = coins?.find((c) => c?.id === post?.coin_id);

  if (!post) return null;

  return (
    <div className="bg-[#222] border border-[#333] rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-start p-4">
        {/* Thumbnail */}
        {firstImage && (
          <div className="flex-shrink-0 w-24 h-24 mr-4">
            <img
              src={fixImageUrl(firstImage)}
              alt=""
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-100 truncate pr-4">
              {post.title}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(post)}
                className="p-1.5 hover:bg-[#333] rounded-lg transition-colors"
              >
                <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-400" />
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="p-1.5 hover:bg-[#333] rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-2">
            {previewText}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <select
                value={post.status || "draft"}
                onChange={(e) => onStatusChange(post.id, e.target.value)}
                className={`text-xs font-medium px-2 py-0.5 rounded-full 
                  ${
                    post.status === "published"
                      ? "bg-green-800/30 text-green-200"
                      : "bg-yellow-800/30 text-yellow-200"
                  } cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              {coin && (
                <span className="text-xs text-gray-500">{coin.name}</span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that groups posts by date
const PostsList = ({
  posts = [],
  coins = [],
  onDelete,
  onStatusChange,
  onEdit,
}) => {
  // Early return if no posts
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#222] border border-[#333] rounded-lg">
        <Calendar className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-300 text-lg font-medium">No posts yet</p>
        <p className="text-gray-500 text-sm mt-1">
          Start creating your first post
        </p>
      </div>
    );
  }

  // Group posts by date
  const groupedPosts = posts.reduce((groups, post) => {
    if (!post?.created_at) return groups;

    const date = new Date(post.created_at);
    const dateStr = format(date, "yyyy-MM-dd");

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(post);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedPosts).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <PostGroup
          key={date}
          date={date}
          posts={groupedPosts[date]}
          coins={coins}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default PostsList;
