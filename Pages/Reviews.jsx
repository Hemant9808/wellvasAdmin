import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { toast } from 'react-hot-toast';
import {
    CheckCircle,
    XCircle,
    Trash2,
    Star,
    Filter,
    Search,
    Eye
} from 'lucide-react';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0
    });

    useEffect(() => {
        fetchReviews();
    }, [filter, pagination.current]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.current,
                limit: 20
            };

            if (filter !== 'all') {
                params.status = filter;
            }

            const response = await axiosInstance.get('/reviews/admin/all', {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Reviews response:', response.data);

            setReviews(response.data.reviews);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            console.error('Error response:', error.response);
            toast.error(error.response?.data?.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const approveReview = async (reviewId) => {
        try {
            await axiosInstance.patch(
                `/reviews/admin/${reviewId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            toast.success('Review approved');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to approve review');
            console.error(error);
        }
    };

    const rejectReview = async (reviewId) => {
        try {
            await axiosInstance.patch(
                `/reviews/admin/${reviewId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            toast.success('Review rejected');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to reject review');
            console.error(error);
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
            console.error(error);
        }
    };

    const filteredReviews = reviews.filter(review =>
        searchTerm === '' ||
        review.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const classes = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
                <p className="text-gray-600">Manage product reviews and ratings</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by product or user email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-400" size={20} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Reviews</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 text-sm">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 text-sm">Approved</p>
                    <p className="text-2xl font-bold text-green-700">
                        {reviews.filter(r => r.status === 'approved').length}
                    </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">
                        {reviews.filter(r => r.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600 text-sm">Rejected</p>
                    <p className="text-2xl font-bold text-red-700">
                        {reviews.filter(r => r.status === 'rejected').length}
                    </p>
                </div>
            </div>

            {/* Reviews Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading reviews...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Review
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReviews.map((review) => (
                                <tr key={review._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {review.productId?.images?.[0]?.url && (
                                                <img
                                                    src={review.productId.images[0].url}
                                                    alt={review.productId.name}
                                                    className="w-12 h-12 rounded object-cover mr-3"
                                                />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {review.productId?.name || 'Product deleted'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {review.userId?.firstName} {review.userId?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">{review.userId?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                />
                                            ))}
                                            <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm font-medium text-gray-900 mb-1">{review.title}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                                        <button
                                            onClick={() => setSelectedReview(review)}
                                            className="text-xs text-green-600 hover:text-green-700 mt-1 flex items-center gap-1"
                                        >
                                            <Eye size={12} />
                                            View Details
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(review.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {review.status !== 'approved' && (
                                                <button
                                                    onClick={() => approveReview(review._id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {review.status !== 'rejected' && (
                                                <button
                                                    onClick={() => rejectReview(review._id)}
                                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteReview(review._id)}
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

                    {filteredReviews.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No reviews found</p>
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

            {/* Review Details Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Product</label>
                                    <p className="text-gray-900">{selectedReview.productId?.name}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">User</label>
                                    <p className="text-gray-900">
                                        {selectedReview.userId?.firstName} {selectedReview.userId?.lastName} ({selectedReview.userId?.email})
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Rating</label>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                className={i < selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Title</label>
                                    <p className="text-gray-900">{selectedReview.title}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Review</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedReview.comment}</p>
                                </div>

                                {selectedReview.images?.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">Images</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {selectedReview.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.url}
                                                    alt={`Review image ${index + 1}`}
                                                    className="w-32 h-32 object-cover rounded-lg"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t">
                                    {selectedReview.status !== 'approved' && (
                                        <button
                                            onClick={() => {
                                                approveReview(selectedReview._id);
                                                setSelectedReview(null);
                                            }}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {selectedReview.status !== 'rejected' && (
                                        <button
                                            onClick={() => {
                                                rejectReview(selectedReview._id);
                                                setSelectedReview(null);
                                            }}
                                            className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700"
                                        >
                                            Reject
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            deleteReview(selectedReview._id);
                                            setSelectedReview(null);
                                        }}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
