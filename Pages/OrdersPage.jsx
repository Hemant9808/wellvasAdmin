import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAllOrders, updateOrderStatus, getOrderStatistics } from '../utils/orderServices';
import { FiEdit2, FiTrendingUp, FiCalendar, FiClock, FiDollarSign, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);
  const [statistics, setStatistics] = useState({
    orders: {
      today: 0,
      lastWeek: 0,
      lastMonth: 0
    },
    sales: {
      today: 0,
      lastWeek: 0,
      lastMonth: 0
    }
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(currentPage);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await getOrderStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, [currentPage]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
      fetchStatistics();
      setShowStatusModal(false);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? <FiChevronLeft className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
          </button>
        </div>

        <div className={`grid grid-cols-1 ${isExpanded ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 mb-6 transition-all duration-300`}>
          {/* Order Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiClock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.orders.today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiCalendar className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Week's Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.orders.lastWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Month's Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.orders.lastMonth}</p>
              </div>
            </div>
          </div>

          {/* Sales Statistics */}
          

        </div>

        <div className='flex justify-between gap-3 mb-4 flex-wrap ' >
        <div className="bg-gradient-to-r w-[20rem] from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white text-blue-600">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white">Today's Sales</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(statistics.sales.today)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r w-[20rem] from-green-500 to-green-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white text-green-600">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white">Last Week's Sales</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(statistics.sales.lastWeek)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r w-[20rem] from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white text-purple-600">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white">Last Month's Sales</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(statistics.sales.lastMonth)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td
                    onClick={() => {
                      // Navigate to order details page
                      window.location.href = `/orders/${order._id}`;
                    }}
                     className="px-6 py-4 cursor-pointer whitespace-nowrap text-sm text-[#3c65e1]">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.paymentResult?.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentResult?.paymentStatus || 'Not Paid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowStatusModal(true);
                        }}
                        className="text-blue-600 flex items-center gap-2 hover:text-blue-900 transition-colors"
                        title="Update Status"
                      >
                        Edit
                        <FiEdit2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Order Status
              </h3>
              <div className="space-y-4">
                <select
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedOrder.orderStatus}
                  onChange={(e) => {
                    setSelectedOrder({
                      ...selectedOrder,
                      orderStatus: e.target.value
                    });
                  }}
                >
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Ready to Ship">Ready to Ship</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder._id, selectedOrder.orderStatus)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
