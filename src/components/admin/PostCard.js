import React from "react";
import { Calendar, X, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Helper function to fix image URLs
const fixImageUrl = (url) => {
  if (!url) return url;
  return url.replace(/(https?:\/\/)\/+/g, "$1").replace(/([^:]\/)\/+/g, "$1");
};

const PostCard = ({ post, coins, onDelete, onStatusChange, onEdit }) => {
  return (
    <div className="bg-[#222] border border-[#333] rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a]">
        <div className="flex items-center space-x-3">
          <select
            value={post.status}
            onChange={(e) => onStatusChange(post.id, e.target.value)}
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(post)}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-1 hover:bg-[#333] rounded-full"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
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
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
