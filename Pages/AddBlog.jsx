import React, { useState } from "react";

export default function AddBlog() {
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState("");

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) setThumbnail(file);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">Add New Blog</h2>

        {/* Blog Title */}
        <div>
          <label className="font-medium">Blog Title *</label>
          <input
            type="text"
            className="w-full border rounded-md p-2 mt-1"
            placeholder="Enter blog title"
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1">
            Keep the title under 100 characters.
          </p>
        </div>

        {/* Blog Category and Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Category *</label>
            <select className="w-full border rounded-md p-2 mt-1">
              <option>Health</option>
              <option>Fitness</option>
              <option>Nutrition</option>
              <option>Lifestyle</option>
            </select>
          </div>
          <div>
            <label className="font-medium">Author Name *</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 mt-1"
              placeholder="Enter author name"
            />
          </div>
        </div>

        {/* Thumbnail Image */}
        <div>
          <label className="font-medium block mb-2">Thumbnail Image</label>
          <div className="flex items-center gap-4">
            {thumbnail && (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail"
                className="w-24 h-24 object-cover rounded border"
              />
            )}
            <label className="border border-dashed p-3 rounded cursor-pointer text-blue-600 hover:border-blue-400">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleThumbnailUpload}
              />
              Upload Image
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Recommended resolution 800x400. JPG or PNG only.
          </p>
        </div>

        {/* Blog Description */}
        <div>
          <label className="font-medium">Blog Content *</label>
          <textarea
            rows={10}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="Write the full blog here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">No character limit.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Publish
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
            Save Draft
          </button>
          <button className="text-blue-500 hover:underline">Preview</button>
        </div>
      </div>
    </div>
  );
}
