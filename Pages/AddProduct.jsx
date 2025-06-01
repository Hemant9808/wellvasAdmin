// src/pages/AddProduct.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axios";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    brand: "",
    manufacturer: "",
    stock: "",
  });
  const [uploadedImages, setUploadedImages] = useState([]); // {url: ...}
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/product/getAllCategories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategories([]);
    setSubcategories([]); // Reset subcategories for new category
  };

  // Handle drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await uploadImages(files);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    await uploadImages(files);
  };

  const uploadImages = async (files) => {
    setUploading(true);
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      try {
        const res = await axios.post(
          "https://medimart-nayg.onrender.com/product/upload-image",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setUploadedImages((prev) => [...prev, { url: res.data.coverImage }]);
      } catch (err) {
        toast.error("Image upload failed");
      }
    }
    setUploading(false);
  };

  // Subcategory logic
  const handleAddSubcategory = () => {
    const trimmed = newSubcategory.trim();
    if (trimmed && !subcategories.includes(trimmed)) {
      setSubcategories((prev) => [...prev, trimmed]);
      setSelectedSubcategories((prev) => [...prev, trimmed]);
      setNewSubcategory("");
    }
  };

  const handleSubcategoryCheck = (subcat) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcat)
        ? prev.filter((s) => s !== subcat)
        : [...prev, subcat]
    );
  };

  // Form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    if (selectedSubcategories.length === 0) {
      toast.error("Please select or add at least one subcategory");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        images: uploadedImages,
        category: [selectedCategory],
        subcategories: selectedSubcategories,
      };
      const res = await axiosInstance.post("/product/addOrUpdateCategory", payload);
      if (res.data.success) {
        toast.success("Product added successfully");
        setFormData({
          name: "",
          description: "",
          price: "",
          discountPrice: "",
          brand: "",
          manufacturer: "",
          stock: "",
        });
        setUploadedImages([]);
        setSelectedSubcategories([]);
        setSubcategories([]);
        setSelectedCategory("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop events
  const handleDragOver = (e) => e.preventDefault();

  // UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Product</h2>
        {/* Category selection first */}
        {!selectedCategory ? (
          <div className="mb-8 flex flex-col items-center">
            <label className="font-medium mb-2">Select Category to Add Product</label>
            <select
              className="border rounded-md p-2 w-80"
              value={selectedCategory}
              onChange={handleCategorySelect}
            >
              <option value="">Choose category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Image upload, Description, Subcategories */}
            <div>
              {/* Image upload area */}
              <div
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center mb-4 relative bg-gray-50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ minHeight: 180 }}
              >
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <span className="text-4xl mb-2 text-blue-400">📤</span>
                  <span className="mb-2 text-gray-600">Drag and drop images here, or click to select files</span>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "UPLOAD"}
                  </button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              {/* Show uploaded images */}
              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {uploadedImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt="product"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              {/* Description */}
              <div className="mb-4">
                <label className="font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mt-1"
                  rows={4}
                  placeholder="Enter product description"
                  maxLength={2000}
                  required
                />
              </div>
              {/* Subcategories */}
              <div className="mb-4">
                <label className="font-medium">Subcategories</label>
                <div className="flex flex-col gap-2 mb-2">
                  {subcategories.map((subcat) => (
                    <label key={subcat} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(subcat)}
                        onChange={() => handleSubcategoryCheck(subcat)}
                      />
                      {subcat}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="border rounded-md p-2 flex-1"
                    placeholder="Add new subcategory"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubcategory())}
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={handleAddSubcategory}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            {/* Right: Product fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-medium">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="Enter product name"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="Enter price"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="font-medium">Discount Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="Enter discount price"
                  min="0"
                />
              </div>
              <div>
                <label className="font-medium">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="Enter brand"
                  required
                />
              </div>
              <div>
                <label className="font-medium">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="Enter manufacturer"
                  required
                />
              </div>
              <div>
                <label className="font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 mt-1"
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  className="border border-gray-400 text-gray-700 px-8 py-2 rounded-full hover:bg-gray-100"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-8 py-2 rounded-full hover:bg-gray-900 disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
