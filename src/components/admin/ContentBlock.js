import React, { useState } from "react";
import { X } from "lucide-react";

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
          value={block.content || ""}
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
        {block.url || imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview || fixImageUrl(block.url)}
              alt={`Image ${index}`}
              className="w-24 h-24 object-cover rounded-lg border border-[#333]"
            />
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
        ) : (
          <div className="relative mb-4 flex-1">
            <div className="w-full border-2 border-dashed border-[#333] rounded-lg p-2 bg-[#111]">
              <input
                type="text"
                placeholder="Click to upload or paste image"
                onPaste={handlePaste}
                onClick={() => document.getElementById(`file-${index}`).click()}
                className="w-full px-3 py-2 text-gray-400 bg-transparent focus:outline-none cursor-pointer"
                readOnly
              />
              <input
                id={`file-${index}`}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
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

export default ContentBlock;
