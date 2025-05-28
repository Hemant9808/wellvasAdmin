import React, { useState, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { FaSearch } from 'react-icons/fa';

const sampleOrders = [
  { id: 1, customer: 'Rahul Sharma', date: '2024-04-15', amount: 1299, status: 'Delivered' },
  { id: 2, customer: 'Priya Jain', date: '2024-04-16', amount: 899, status: 'Pending' },
  { id: 3, customer: 'Amit Verma', date: '2024-04-17', amount: 499, status: 'Cancelled' },
  // ...add more dummy data as needed
];

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState(sampleOrders);
  const pageSize = 5;

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, orders]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const currentOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center border rounded px-2 bg-white w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            className="outline-none w-full py-2"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CSVLink
          data={filteredOrders}
          filename="orders.csv"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Download CSV
        </CSVLink>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow rounded hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">₹{order.amount}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Collapsible */}
      <div className="md:hidden">
        {currentOrders.map((order) => (
          <div key={order.id} className="border rounded p-4 my-2 shadow bg-white">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer:</strong> {order.customer}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Amount:</strong> ₹{order.amount}</p>
            <p><strong>Status:</strong>{' '}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 bg-white mt-1"
              >
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <p>
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
