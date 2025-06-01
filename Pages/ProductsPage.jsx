import { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { CSVLink } from 'react-csv';
import axiosInstance from '../utils/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/product/getAllCategories');
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async (category = '') => {
    setLoading(true);
    try {
      let res;
      if (category) {
        res = await axiosInstance.get(`/product/getProductByCategories?category=${encodeURIComponent(category)}`);
        setProducts(res.data);
      } else {
        res = await axiosInstance.get('/product/getAllProducts');
        setProducts(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setPage(1);
    fetchProducts(cat);
  };

  // Search filter
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Edit and Delete handlers (implement navigation and API call as needed)
  const handleEdit = (id) => {
    toast.info('Edit product: ' + id);
    // navigate(`/edit-product/${id}`) or open modal
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axiosInstance.delete(`/product/deleteProduct/${id}`);
      toast.success('Product deleted');
      fetchProducts(selectedCategory);
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="p-4">
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
        <select
          className="border px-3 py-1 rounded w-full md:w-64"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <CSVLink
          data={filtered}
          filename="products.csv"
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FiDownload /> Download CSV
        </CSVLink>
      </div>

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
            {loading ? (
              <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4">No products found</td></tr>
            ) : paginated.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="w-14 h-14 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.brand}</td>
                <td className="p-2 border">₹{product.price}</td>
                <td className="p-2 border">{product.stock}</td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              i + 1 === page ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
