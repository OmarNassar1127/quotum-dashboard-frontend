import React from 'react';
import { Type, ImageIcon } from 'lucide-react';
import ContentBlock from './ContentBlock';

const PostForm = ({ 
  formData, 
  setFormData, 
  coins, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
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

  return (
    <div className="mb-6 bg-[#222] border border-[#333] rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        {isEditing ? 'Edit Post' : 'Create New Post'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
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
            onClick={onCancel}
            className="px-4 py-2 border border-[#333] text-gray-200 bg-[#222] rounded-lg hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;