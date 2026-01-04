import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FiSearch,
  FiDownload,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [stock, setStock] = useState(0);
  const [selectedProductId, SetselectedProductId] = useState("");
  const pageSize = 10;

  // 🧠 useCallback to prevent recreating functions on every render
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/product/getAllCategories");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  }, []);

  const fetchProducts = useCallback(async (category = "") => {
    setLoading(true);
    try {
      const endpoint = category
        ? `/product/getProductByCategories?category=${encodeURIComponent(category)}`
        : "/product/getAllProducts";
      const res = await axiosInstance.get(endpoint);
      setProducts(res.data || []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 🧩 parallel fetching to save time - only on mount
    setInitialLoading(true);
    Promise.all([fetchCategories(), fetchProducts()])
      .catch(() => { })
      .finally(() => setInitialLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on component mount

  const updateStock = useCallback(async () => {
    try {
      await axiosInstance.post(`/product/updateStock`, {
        id: selectedProductId,
        stock: stock,
      });
      toast.success("Stock updated successfully");
      setSelectedMessage(null);
      fetchProducts(selectedCategory);
    } catch {
      toast.error("Failed to update stock");
    }
  }, [selectedProductId, stock, selectedCategory, fetchProducts]);

  const handleAddCategory = useCallback(async () => {
    if (!newCategory.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await axiosInstance.post("/product/addCategory", { name: newCategory });
      toast.success("Category added successfully");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  }, [newCategory, fetchCategories]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      try {
        await axiosInstance.delete(`/product/deleteProduct/${id}`);
        toast.success("Product deleted");
        fetchProducts(selectedCategory);
      } catch {
        toast.error("Failed to delete product");
      }
    },
    [selectedCategory, fetchProducts]
  );

  // 🧮 useMemo to avoid recalculating filtered and paginated arrays
  const filtered = useMemo(
    () =>
      products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const totalPages = useMemo(
    () => Math.ceil(filtered.length / pageSize),
    [filtered.length, pageSize]
  );

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  return (
    <div className="p-4">
      {/* Categories Section */}
      <div className="mb-8">
        {initialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="p-4 border rounded shadow-sm animate-pulse bg-white">
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`p-4 border rounded shadow-sm cursor-pointer transition-all ${selectedCategory === category._id
                  ? "bg-green-50 border-green-500"
                  : "bg-white hover:shadow-md"
                  }`}
                onClick={() => {
                  setSelectedCategory(category._id);
                  fetchProducts(category.name);
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search + CSV */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-full md:w-64"
          />
        </div>
        <CSVLink
          data={filtered}
          filename="products.csv"
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FiDownload /> Download CSV
        </CSVLink>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border rounded shadow bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Image</th>
              <th className="text-left p-2 border">Product Name</th>
              <th className="text-left p-2 border">Brand</th>
              <th className="text-left p-2 border">Price</th>
              <th className="text-left p-2 border">Stock</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading || initialLoading ? (
              // Skeleton loader
              [...Array(pageSize)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-2 border">
                    <div className="w-14 h-14 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-2 border">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="p-2 border">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="p-2 border">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="p-2 border">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No products found
                </td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        loading="lazy"
                        className="w-14 h-14 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56"%3E%3Crect fill="%23f0f0f0" width="56" height="56"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.brand}</td>
                  <td className="p-2 border">₹{product.price}</td>
                  <td
                    onClick={() => {
                      setSelectedMessage(true);
                      setStock(product.stock);
                      SetselectedProductId(product._id);
                    }}
                    className="p-2 border cursor-pointer"
                  >
                    <p className="text-blue-400">{product.stock}</p>
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/addproducts/${product._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit product"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete product"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${i + 1 === page ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Stock Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-lg w-full relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setSelectedMessage(null)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-2">Manage Stocks</h3>
            <div className="px-[5rem] flex items-center gap-2 mb-4 justify-between">
              <button
                onClick={() => setStock(stock + 1)}
                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +1
              </button>
              <input
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                type="number"
                className="border text-center w-20"
              />
              <button
                onClick={() => setStock(stock - 1)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -1
              </button>
            </div>

            <button
              onClick={updateStock}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
