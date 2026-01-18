import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { toast } from 'react-hot-toast';
import {
    FileText,
    Search,
    Filter,
    Eye,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    Calendar,
    User,
    DollarSign,
    X
} from 'lucide-react';

const OfflineInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0
    });

    useEffect(() => {
        fetchInvoices();
    }, [pagination.current, paymentStatusFilter, searchTerm, dateRange]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.current,
                limit: 20,
                search: searchTerm
            };

            if (paymentStatusFilter !== 'all') {
                params.paymentStatus = paymentStatusFilter;
            }

            if (dateRange.start) {
                params.startDate = dateRange.start;
            }

            if (dateRange.end) {
                params.endDate = dateRange.end;
            }

            const response = await axiosInstance.get('/offline-invoices', { params });

            setInvoices(response.data.invoices);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('Failed to fetch invoices');
        } finally {
            setLoading(false);
        }
    };

    const viewInvoiceDetails = async (invoiceId) => {
        try {
            const response = await axiosInstance.get(`/offline-invoices/${invoiceId}`);
            setSelectedInvoice(response.data.invoice);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching invoice details:', error);
            toast.error('Failed to load invoice details');
        }
    };

    const updatePaymentStatus = async (invoiceId, newStatus, paidAmount = null) => {
        try {
            const updateData = { paymentStatus: newStatus };
            if (paidAmount !== null) {
                updateData.paidAmount = paidAmount;
            }

            await axiosInstance.patch(`/offline-invoices/${invoiceId}/payment`, updateData);
            toast.success('Payment status updated!');
            fetchInvoices();
            if (selectedInvoice && selectedInvoice._id === invoiceId) {
                viewInvoiceDetails(invoiceId); // Refresh modal
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Failed to update payment status');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            paid: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} /> },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={14} /> },
            partial: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <DollarSign size={14} /> },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle size={14} /> }
        };

        const badge = badges[status] || badges.pending;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.icon}
                {status.toUpperCase()}
            </span>
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setPaymentStatusFilter('all');
        setDateRange({ start: '', end: '' });
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice History</h1>
                <p className="text-gray-600">View and manage all saved invoices</p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by invoice number or customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Payment Status Filter */}
                    <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="partial">Partial</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Date Range */}
                    <div className="flex gap-2 items-center">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || paymentStatusFilter !== 'all' || dateRange.start || dateRange.end) && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Invoices Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading invoices...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{invoice.customerSnapshot?.name}</p>
                                            <p className="text-xs text-gray-500">{invoice.customerSnapshot?.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} />
                                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="font-semibold text-gray-900">₹{invoice.total?.toLocaleString()}</p>
                                            {invoice.paymentStatus === 'partial' && (
                                                <p className="text-xs text-gray-500">Due: ₹{invoice.dueAmount?.toLocaleString()}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-600">{invoice.paymentMethod?.toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(invoice.paymentStatus)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => viewInvoiceDetails(invoice._id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {invoices.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="text-gray-500 mt-4">No invoices found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page {pagination.current} of {pagination.pages} ({pagination.total} total)
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

            {/* Invoice Detail Modal */}
            {showDetailModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
                                    <p className="text-gray-600">Invoice #{selectedInvoice.invoiceNumber}</p>
                                </div>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Name</p>
                                        <p className="text-sm font-medium">{selectedInvoice.customerSnapshot?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm font-medium">{selectedInvoice.customerSnapshot?.phone}</p>
                                    </div>
                                    {selectedInvoice.customerSnapshot?.email && (
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm font-medium">{selectedInvoice.customerSnapshot.email}</p>
                                        </div>
                                    )}
                                    {selectedInvoice.customerSnapshot?.gstin && (
                                        <div>
                                            <p className="text-xs text-gray-500">GSTIN</p>
                                            <p className="text-sm font-medium">{selectedInvoice.customerSnapshot.gstin}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Product</th>
                                            <th className="px-3 py-2 text-left">HSN</th>
                                            <th className="px-3 py-2 text-right">Qty</th>
                                            <th className="px-3 py-2 text-right">Rate</th>
                                            <th className="px-3 py-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedInvoice.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2">{item.name}</td>
                                                <td className="px-3 py-2">{item.hsn}</td>
                                                <td className="px-3 py-2 text-right">{item.quantity}</td>
                                                <td className="px-3 py-2 text-right">₹{item.rate}</td>
                                                <td className="px-3 py-2 text-right font-semibold">₹{item.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">₹{selectedInvoice.subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">CGST (2.5%):</span>
                                        <span className="font-medium">₹{selectedInvoice.cgst?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">SGST (2.5%):</span>
                                        <span className="font-medium">₹{selectedInvoice.sgst?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span>Total:</span>
                                        <span className="text-green-600">₹{selectedInvoice.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h3>
                                <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <div className="mt-1">{getStatusBadge(selectedInvoice.paymentStatus)}</div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Method</p>
                                        <p className="text-sm font-medium mt-1">{selectedInvoice.paymentMethod?.toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Paid Amount</p>
                                        <p className="text-sm font-medium mt-1 text-green-600">₹{selectedInvoice.paidAmount?.toFixed(2)}</p>
                                    </div>
                                </div>
                                {selectedInvoice.dueAmount > 0 && (
                                    <div className="pt-2 border-t border-blue-200">
                                        <p className="text-xs text-gray-500">Due Amount</p>
                                        <p className="text-lg font-bold text-red-600">₹{selectedInvoice.dueAmount?.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Payment Status Update */}
                            {selectedInvoice.paymentStatus !== 'paid' && selectedInvoice.paymentStatus !== 'cancelled' && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Update Payment Status</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updatePaymentStatus(selectedInvoice._id, 'paid', selectedInvoice.total)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            Mark as Paid
                                        </button>
                                        {selectedInvoice.paymentStatus !== 'partial' && (
                                            <button
                                                onClick={() => updatePaymentStatus(selectedInvoice._id, 'partial', selectedInvoice.total / 2)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Mark as Partial
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfflineInvoices;
