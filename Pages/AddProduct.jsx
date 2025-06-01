// src/pages/AddProduct.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axios";
import { FiPlus, FiX, FiCheck, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
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

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await axiosInstance.post("/product/addOrUpdateCategory", { name: newCategory });
      toast.success("Category added successfully");
      setNewCategory("");
      setShowAddCategory(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleEditCategory = async (categoryId, newName) => {
    try {
      await axiosInstance.post("/product/addOrUpdateCategory", { 
        _id: categoryId,
        name: newName 
      });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    // if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axiosInstance.delete(`/product/deleteCategory/${categoryId}`);
      toast.success("Category deleted successfully");
      if (selectedCategory === categoryId) {
        setSelectedCategory("");
      }
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategories([]);
    setSubcategories([]);
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
        
        {/* Category Selection Section */}
        {!selectedCategory ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Select a Category</h3>
              <button
                onClick={() => setShowAddCategory(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <FiPlus /> Add New Category
              </button>
            </div>

            {showAddCategory && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FiCheck /> Save
                  </button>
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div
                onClick={() => handleCategorySelect(category._id)}
                  key={category._id}
                  className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedCategory === category._id
                      ? "bg-green-50 border-green-500 shadow-md"
                      : "bg-white hover:border-green-300"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      selectedCategory === category._id ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      <span className="text-2xl">📦</span>
                    </div>
                    {editingCategory === category._id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          defaultValue={category.name}
                          className="border rounded px-2 py-1 flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditCategory(category._id, e.target.value);
                            }
                          }}
                        />
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div 
                      
                      >
                        <h4 
                          className="font-medium text-lg"
                          onClick={() => handleCategorySelect(category._id)}
                        >
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {category.subcategories?.length || 0} subcategories
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(category._id);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit category"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category._id);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete category"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
        <ToastContainer />
      </div>
    </div>
  );
}
