import React, { useRef } from "react";
import { X, Upload } from "lucide-react";

const ContentBlock = ({ block, index, onChange, onDelete }) => {
  const fileInputRef = useRef(null);

  if (block.type === "text") {
    return (
      <div className="relative group">
        <textarea
          value={block.content}
          onChange={(e) =>
            onChange(index, { ...block, content: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder="Enter your text here..."
        />
        <button
          onClick={() => onDelete(index)}
          className="absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (block.type === "image") {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create a preview URL for the selected file
        const previewUrl = URL.createObjectURL(file);
        onChange(index, {
          ...block,
          file: file,
          previewUrl: previewUrl,
          // Keep the url if it exists (for existing images)
          url: block.url || null,
        });
      }
    };

    return (
      <div className="relative group">
        <div className="border border-gray-300 rounded-lg p-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          {!block.file && !block.url ? (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full px-3 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload image
                </span>
              </div>
            </button>
          ) : (
            <div className="relative">
              <img
                src={block.previewUrl || block.url}
                alt="Preview"
                className="mt-2 max-h-[200px] object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                Change image
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(index)}
          className="absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return null;
};

export default ContentBlock;
