import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Edit2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Search,
    Filter,
    Calendar,
    TrendingUp,
    Tag,
    Users,
    DollarSign
} from 'lucide-react';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');



    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        description: '',
        applicationType: 'all',
        applicableProducts: [],
        applicableCategories: [],
        requiresAllProducts: false,
        expiryDate: '',
        isActive: true,
        maxUses: 0,
        maxUsesPerUser: 0,
        minOrderAmount: 0
    });

    useEffect(() => {
        fetchCoupons();
        fetchProducts();
        fetchCategories();
        fetchStats();
    }, [filter]);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await axiosInstance.get('/coupons', { params });
            setCoupons(response.data.coupons);
        } catch (error) {
            toast.error('Failed to fetch coupons');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/product/getAllProducts');
            setProducts(response.data.products || response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/product/getAllCategories');
            setCategories(response.data.categories || response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/coupons/stats');
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };

            // Convert string values to numbers
            payload.value = parseFloat(payload.value);
            payload.maxUses = parseInt(payload.maxUses) || 0;
            payload.maxUsesPerUser = parseInt(payload.maxUsesPerUser) || 0;
            payload.minOrderAmount = parseFloat(payload.minOrderAmount) || 0;

            // Set expiryDate to null if empty
            if (!payload.expiryDate) {
                payload.expiryDate = null;
            }

            if (editingCoupon) {
                await axiosInstance.put(`/coupons/${editingCoupon._id}`, payload);
                toast.success('Coupon updated successfully');
            } else {
                await axiosInstance.post('/coupons', payload);
                toast.success('Coupon created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchCoupons();
            fetchStats();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save coupon');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;

        try {
            await axiosInstance.delete(`/coupons/${id}`);
            toast.success('Coupon deleted successfully');
            fetchCoupons();
            fetchStats();
        } catch (error) {
            toast.error('Failed to delete coupon');
            console.error(error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await axiosInstance.patch(`/coupons/${id}/toggle-status`);
            toast.success('Coupon status updated');
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to update coupon status');
            console.error(error);
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            description: coupon.description,
            applicationType: coupon.applicationType,
            applicableProducts: coupon.applicableProducts?.map(p => p._id) || [],
            applicableCategories: coupon.applicableCategories?.map(c => c._id) || [],
            requiresAllProducts: coupon.requiresAllProducts,
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            isActive: coupon.isActive,
            maxUses: coupon.maxUses,
            maxUsesPerUser: coupon.maxUsesPerUser,
            minOrderAmount: coupon.minOrderAmount
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            code: '',
            type: 'percentage',
            value: '',
            description: '',
            applicationType: 'all',
            applicableProducts: [],
            applicableCategories: [],
            requiresAllProducts: false,
            expiryDate: '',
            isActive: true,
            maxUses: 0,
            maxUsesPerUser: 0,
            minOrderAmount: 0
        });
        setEditingCoupon(null);
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (coupon) => {
        if (!coupon.isActive) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Inactive</span>;
        }
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Expired</span>;
        }
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Active</span>;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
                <p className="text-gray-600">Create and manage discount coupons</p>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Coupons</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCoupons}</p>
                            </div>
                            <Tag className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Active Coupons</p>
                                <p className="text-2xl font-bold text-green-700">{stats.activeCoupons}</p>
                            </div>
                            <TrendingUp className="text-green-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600">Total Usage</p>
                                <p className="text-2xl font-bold text-purple-700">{stats.totalUsage}</p>
                            </div>
                            <Users className="text-purple-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Total Discounts Given</p>
                                <p className="text-2xl font-bold text-yellow-700">₹{stats.totalDiscountGiven}</p>
                            </div>
                            <DollarSign className="text-yellow-500" size={32} />
                        </div>
                    </div>
                </div>
            )}

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search coupons..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-400" size={20} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Coupons</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <Plus size={20} />
                        Create Coupon
                    </button>
                </div>
            </div>

            {/* Coupons Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading coupons...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicability</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCoupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{coupon.code}</p>
                                            <p className="text-xs text-gray-500">{coupon.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${coupon.type === 'percentage'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {coupon.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {coupon.applicationType === 'all' && 'All Products'}
                                        {coupon.applicationType === 'products' && `${coupon.applicableProducts?.length || 0} Products`}
                                        {coupon.applicationType === 'categories' && `${coupon.applicableCategories?.length || 0} Categories`}
                                        {coupon.applicationType === 'combination' && 'Combo'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {coupon.usedCount} {coupon.maxUses > 0 ? `/ ${coupon.maxUses}` : ''}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(coupon)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(coupon._id)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                                title={coupon.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {coupon.isActive ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(coupon)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCoupons.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No coupons found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coupon Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                                        placeholder="WELCOME10"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="10% off for new customers"
                                        required
                                    />
                                </div>

                                {/* Type and Value */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Type *
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Value *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder={formData.type === 'percentage' ? '10' : '100'}
                                            min="0"
                                            step={formData.type === 'percentage' ? '1' : '0.01'}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Applicability Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Applies To *
                                    </label>
                                    <select
                                        value={formData.applicationType}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            applicationType: e.target.value,
                                            applicableProducts: [],
                                            applicableCategories: []
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="all">All Products</option>
                                        <option value="products">Specific Products</option>
                                        <option value="categories">Specific Categories</option>
                                        <option value="combination">Product Combination</option>
                                    </select>
                                </div>

                                {/* Product Selector */}
                                {(formData.applicationType === 'products' || formData.applicationType === 'combination') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Products *
                                        </label>
                                        <select
                                            multiple
                                            value={formData.applicableProducts}
                                            onChange={(e) => {
                                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                                setFormData({ ...formData, applicableProducts: selected });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                                        >
                                            {products.map(product => (
                                                <option key={product._id} value={product._id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                                    </div>
                                )}

                                {/* Category Selector */}
                                {formData.applicationType === 'categories' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Categories *
                                        </label>
                                        <select
                                            multiple
                                            value={formData.applicableCategories}
                                            onChange={(e) => {
                                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                                setFormData({ ...formData, applicableCategories: selected });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                                        >
                                            {categories.map(category => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                                    </div>
                                )}

                                {/* Combination Type */}
                                {formData.applicationType === 'combination' && (
                                    <div>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.requiresAllProducts}
                                                onChange={(e) => setFormData({ ...formData, requiresAllProducts: e.target.checked })}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700">Require ALL selected products (strict combo)</span>
                                        </label>
                                    </div>
                                )}

                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {/* Usage Limits */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Total Uses (0 = Unlimited)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.maxUses}
                                            onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Uses Per User (0 = Unlimited)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.maxUsesPerUser}
                                            onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Min Order Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Order Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                {/* Active Status */}
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Active (users can use this coupon)</span>
                                    </label>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                                    >
                                        {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
