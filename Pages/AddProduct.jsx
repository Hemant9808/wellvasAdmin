// src/pages/AddProduct.jsx
import { useState } from "react";

export default function AddProduct() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Form Fields */}
        <div>
          <div className="mb-4">
            <label className="font-medium">Product name *</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 mt-1"
              placeholder="Enter product name"
              maxLength={20}
            />
            <p className="text-xs text-gray-400 mt-1">
              Do not exceed 20 characters when entering the product name.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="font-medium">Category *</label>
              <select className="w-full border rounded-md p-2 mt-1">
                <option>Choose category</option>
              </select>
            </div>
            <div>
              <label className="font-medium">Gender *</label>
              <select className="w-full border rounded-md p-2 mt-1">
                <option>Male</option>
                <option>Female</option>
                <option>Unisex</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-medium">Brand *</label>
            <select className="w-full border rounded-md p-2 mt-1">
              <option>Choose brand</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Description *</label>
            <textarea
              className="w-full border rounded-md p-2 mt-1"
              rows={4}
              placeholder="Description"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1">
              Do not exceed 100 characters.
            </p>
          </div>
        </div>

        {/* Right Section: Images, Sizes, Date, Buttons */}
        <div>
          <label className="font-medium mb-2 block">Upload images</label>
          <div className="flex gap-2 mb-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt="product"
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
            <label className="w-20 h-20 border border-dashed flex items-center justify-center cursor-pointer rounded text-blue-500 hover:border-blue-400">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              +
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            You need to add at least 4 images. Ensure good quality and format.
          </p>

          <div className="mb-4">
            <label className="font-medium">Add size</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["EU - 38.5", "EU - 39", "EU - 40", "EU - 41.5", "EU - 42", "EU - 43", "EU - 44"].map((size) => (
                <button key={size} className="border px-3 py-2 rounded text-sm hover:bg-gray-100">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="font-medium">Product date</label>
            <input
              type="date"
              className="w-full border rounded-md p-2 mt-1"
              placeholder="dd-mm-yyyy"
            />
          </div>

          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add product
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              Save product
            </button>
            <button className="text-blue-500 hover:underline">Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
}
