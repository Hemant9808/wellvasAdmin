import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { FiStar, FiTrendingUp } from "react-icons/fi";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [productView, setProductView] = useState('all'); // 'all', 'featured', 'best-selling'

  useEffect(() => {
    if (activeTab === 'product') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/product/getAllProducts');
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product._id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (productView === 'all') return matchesSearch;
    if (productView === 'featured') return matchesSearch && product.isFeatured;
    if (productView === 'best-selling') return matchesSearch && product.isBestSelling;
    return matchesSearch;
  });

  const stats = {
    total: products.length,
    featured: products.filter(p => p.isFeatured).length,
    bestSelling: products.filter(p => p.isBestSelling).length
  };

  const toggleFeatured = async (productId, currentStatus) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/product/mark-featured`, { productId });
      toast.success("Product featured status updated");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update featured status");
    } finally {
      setLoading(false);
    }
  };

  const toggleBestSelling = async (productId, currentStatus) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/product/mark-best-selling`, { productId });
      toast.success("Product best-selling status updated");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update best-selling status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b mb-6">
        {['general', 'payment', 'product'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 border-b-2 ${
              activeTab === tab ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'general' && 'General Settings'}
            {tab === 'payment' && 'Payment Settings'}
            {tab === 'product' && 'Product Settings'}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Admin Details</h3>
            <div className="grid gap-4">
              <input type="text" placeholder="Admin Name" className="border px-3 py-2 rounded w-full" />
              <input type="email" placeholder="Admin Email" className="border px-3 py-2 rounded w-full" />
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="grid gap-4">
              <input type="password" placeholder="Current Password" className="border px-3 py-2 rounded w-full" />
              <input type="password" placeholder="New Password" className="border px-3 py-2 rounded w-full" />
              <input type="password" placeholder="Confirm New Password" className="border px-3 py-2 rounded w-full" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold mb-4">Razorpay Settings</h3>
          <input
            type="text"
            placeholder="Razorpay Account Key"
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Razorpay Secret"
            className="border px-3 py-2 rounded w-full"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Razorpay Config</button>
        </div>
      )}

      {/* Product Settings */}
      {activeTab === 'product' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white">
              <h4 className="text-sm text-gray-500 mb-1">Total Products</h4>
              <p className="text-2xl font-bold">{stats.total}</p>
            </Card>
            <Card className="p-4 bg-white">
              <h4 className="text-sm text-gray-500 mb-1">Featured Products</h4>
              <p className="text-2xl font-bold">{stats.featured}</p>
            </Card>
            <Card className="p-4 bg-white">
              <h4 className="text-sm text-gray-500 mb-1">Best Selling Products</h4>
              <p className="text-2xl font-bold">{stats.bestSelling}</p>
            </Card>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <h3 className="text-lg font-semibold">Product Management</h3>
                <div className="flex gap-2">
                  <Button
                    variant={productView === 'all' ? 'default' : 'outline'}
                    onClick={() => setProductView('all')}
                  >
                    All Products
                  </Button>
                  <Button
                    variant={productView === 'featured' ? 'default' : 'outline'}
                    onClick={() => setProductView('featured')}
                  >
                    Featured
                  </Button>
                  <Button
                    variant={productView === 'best-selling' ? 'default' : 'outline'}
                    onClick={() => setProductView('best-selling')}
                  >
                    Best Selling
                  </Button>
                </div>
              </div>
              <Input
                type="text"
                placeholder="Search by ID or name..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-64"
              />
            </div>

            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product._id} className="p-4 relative">
                    {/* Status Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {product.isFeatured && (
                        <div className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <FiStar className="w-3 h-3" />
                          Featured
                        </div>
                      )}
                      {product.isBestSelling && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <FiTrendingUp className="w-3 h-3" />
                          Best Seller
                        </div>
                      )}
                    </div>

                    <div className="aspect-square mb-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          No Image
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">ID: {product._id}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleFeatured(product._id, product.isFeatured)}
                        variant={product.isFeatured ? "destructive" : "outline"}
                        className="flex-1"
                      >
                        {product.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                      </Button>
                      <Button
                        onClick={() => toggleBestSelling(product._id, product.isBestSelling)}
                        variant={product.isBestSelling ? "destructive" : "outline"}
                        className="flex-1"
                      >
                        {product.isBestSelling ? "Remove from Best Selling" : "Mark as Best Selling"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
