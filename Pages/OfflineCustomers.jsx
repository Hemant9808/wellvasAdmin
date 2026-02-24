import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { toast } from 'react-hot-toast';
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Phone,
    Mail,
    MapPin,
    FileText, Tag,
    TrendingUp
} from 'lucide-react';

const OfflineCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0
    });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: {
            fullAddress: '',
            city: '',
            state: '',
            pincode: ''
        },
        gstin: '',
        pan: '',
        notes: '',
        preferences: '',
        customerType: 'new'
    });

    useEffect(() => {
        fetchCustomers();
    }, [pagination.current, filter, searchTerm]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.current,
                limit: 20,
                search: searchTerm
            };

            if (filter !== 'all') {
                params.customerType = filter;
            }

            const response = await axiosInstance.get('/offline-customers', { params });

            setCustomers(response.data.customers);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: {
                fullAddress: '',
                city: '',
                state: '',
                pincode: ''
            },
            gstin: '',
            pan: '',
            notes: '',
            preferences: '',
            customerType: 'new'
        });
        setEditingCustomer(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCustomer) {
                await axiosInstance.put(`/offline-customers/${editingCustomer._id}`, formData);
                toast.success('Customer updated successfully');
            } else {
                await axiosInstance.post('/offline-customers', formData);
                toast.success('Customer created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchCustomers();
        } catch (error) {
            console.error('Error saving customer:', error);
            toast.error(error.response?.data?.message || 'Failed to save customer');
        }
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name || '',
            phone: customer.phone || '',
            email: customer.email || '',
            address: {
                fullAddress: customer.address?.fullAddress || '',
                city: customer.address?.city || '',
                state: customer.address?.state || '',
                pincode: customer.address?.pincode || ''
            },
            gstin: customer.gstin || '',
            pan: customer.pan || '',
            notes: customer.notes || '',
            preferences: customer.preferences || '',
            customerType: customer.customerType || 'new'
        });
        setShowModal(true);
    };

    const handleDelete = async (customerId) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/offline-customers/${customerId}`);
            toast.success('Customer deleted successfully');
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('Failed to delete customer');
        }
    };

    const getCustomerTypeBadge = (type) => {
        const badges = {
            new: 'bg-blue-100 text-blue-800',
            regular: 'bg-green-100 text-green-800',
            wholesale: 'bg-purple-100 text-purple-800',
            vip: 'bg-yellow-100 text-yellow-800'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[type]}`}>
                {type.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Offline Customers</h1>
                <p className="text-gray-600">Manage walk-in and offline customers</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="all">All Customers</option>
                        <option value="new">New</option>
                        <option value="regular">Regular</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="vip">VIP</option>
                    </select>

                    {/* Add Button */}
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                        <Plus size={20} />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Customers Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading customers...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                            {customer.gstin && (
                                                <p className="text-xs text-gray-500">GSTIN: {customer.gstin}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} />
                                                {customer.phone}
                                            </div>
                                            {customer.email && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} />
                                                    {customer.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getCustomerTypeBadge(customer.customerType)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="text-gray-900">₹{customer.totalSpent?.toLocaleString() || 0}</p>
                                            <p className="text-xs text-gray-500">{customer.totalPurchases || 0} purchases</p>
                                            {customer.totalDue > 0 && (
                                                <p className="text-xs text-red-600 font-semibold mt-1">Due: ₹{customer.totalDue?.toLocaleString() || 0}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(customer)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer._id)}
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

                    {customers.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="text-gray-500 mt-4">No customers found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page {pagination.current} of {pagination.pages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                                    disabled={pagination.current === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                                    disabled={pagination.current === pagination.pages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            pattern="[0-9]{10}"
                                            placeholder="10-digit number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                                    <textarea
                                        name="address.fullAddress"
                                        value={formData.address.fullAddress}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Full address"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <div className="grid grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={formData.address.city}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={formData.address.state}
                                            onChange={handleInputChange}
                                            placeholder="State"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            name="address.pincode"
                                            value={formData.address.pincode}
                                            onChange={handleInputChange}
                                            placeholder="Pincode"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Business Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">GSTIN</label>
                                        <input
                                            type="text"
                                            name="gstin"
                                            value={formData.gstin}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">PAN</label>
                                        <input
                                            type="text"
                                            name="pan"
                                            value={formData.pan}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Customer Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Type</label>
                                    <select
                                        name="customerType"
                                        value={formData.customerType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="new">New</option>
                                        <option value="regular">Regular</option>
                                        <option value="wholesale">Wholesale</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                                    >
                                        {editingCustomer ? 'Update Customer' : 'Add Customer'}
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

export default OfflineCustomers;
