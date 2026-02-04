import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import {
    Search,
    Filter,
    Gift,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    Eye,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReward, setSelectedReward] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchRewards();
        fetchStats();
    }, [filter]);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await axios.get('/rewards/admin/all', { params });
            setRewards(response.data.rewards || []);
        } catch (error) {
            toast.error('Failed to fetch rewards');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/rewards/admin/stats');
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const filteredRewards = rewards.filter(reward =>
        reward.rewardCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (reward) => {
        if (reward.status === 'claimed') {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Claimed</span>;
        }
        if (reward.status === 'expired' || (reward.expiresAt && new Date(reward.expiresAt) < new Date())) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Expired</span>;
        }
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
    };

    const viewRewardDetails = (reward) => {
        setSelectedReward(reward);
        setShowDetailsModal(true);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Management</h1>
                <p className="text-gray-600">View and manage instant cashback rewards</p>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Rewards</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalRewards}</p>
                            </div>
                            <Gift className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Claimed</p>
                                <p className="text-2xl font-bold text-green-700">{stats.claimedRewards}</p>
                            </div>
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-700">{stats.pendingRewards}</p>
                            </div>
                            <Clock className="text-yellow-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600">Total Cashback</p>
                                <p className="text-2xl font-bold text-purple-700">₹{stats.totalCashback || 0}</p>
                            </div>
                            <DollarSign className="text-purple-500" size={32} />
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
                                placeholder="Search by code, email, or name..."
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
                            <option value="all">All Rewards</option>
                            <option value="pending">Pending</option>
                            <option value="claimed">Claimed</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Rewards Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading rewards...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimed</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRewards.map((reward) => (
                                <tr key={reward._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-mono font-bold text-gray-900">{reward.rewardCode}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {reward.userId?.firstName} {reward.userId?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500">{reward.userId?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-900">₹{reward.cashbackAmount}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(reward)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(reward.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {reward.claimedAt ? formatDate(reward.claimedAt) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => viewRewardDetails(reward)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRewards.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No rewards found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedReward && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Reward Details</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Reward Code */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Reward Code</p>
                                    <p className="text-2xl font-mono font-bold text-gray-900">{selectedReward.rewardCode}</p>
                                </div>

                                {/* Amount */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-600 mb-1">Cashback Amount</p>
                                        <p className="text-2xl font-bold text-green-700">₹{selectedReward.cashbackAmount}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                        <div className="mt-1">{getStatusBadge(selectedReward)}</div>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">User Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedReward.userId?.firstName} {selectedReward.userId?.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedReward.userId?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedReward.userId?.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">User ID</p>
                                            <p className="text-sm font-mono text-gray-900">{selectedReward.userId?._id}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div className="flex justify-between">
                                            <p className="text-sm text-gray-600">Created</p>
                                            <p className="text-sm font-medium text-gray-900">{formatDate(selectedReward.createdAt)}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm text-gray-600">Expires</p>
                                            <p className="text-sm font-medium text-gray-900">{formatDate(selectedReward.expiresAt)}</p>
                                        </div>
                                        {selectedReward.claimedAt && (
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-600">Claimed</p>
                                                <p className="text-sm font-medium text-green-700">{formatDate(selectedReward.claimedAt)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Note */}
                                {selectedReward.status === 'claimed' && (
                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Action Required:</strong> User should have sent screenshot via WhatsApp to 918799722636. Verify the screenshot and UPI ID before transferring ₹{selectedReward.cashbackAmount}.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
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

export default Rewards;
