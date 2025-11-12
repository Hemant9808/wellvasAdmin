import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import { FiDownload } from 'react-icons/fi'; // Import for download icon
import { CSVLink } from "react-csv"; // Ensure this is imported

const TABS = ['Get User', 'All Users', 'Frequent Buyers'];

function UserDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const [userQuery, setUserQuery] = useState({ userId: '', email: '' });
  const [userData, setUserData] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [frequentBuyers, setFrequentBuyers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // State to hold full lists for CSV download (Performance improvement)
  const [allUsersForCSV, setAllUsersForCSV] = useState([]);
  const [buyersForCSV, setBuyersForCSV] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false); // Separate loading state for downloads

  // --- Fetching Functions (Unchanged Logic for Paginated View) ---

  const fetchUser = async () => {
    try {
      setError('');
      setLoading(true);
      const res = await axiosInstance.post('/auth/getUser', userQuery);
      setUserData(res.data.user);
    } catch (err) {
      setUserData(null);
      setError(err.response?.data?.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setError('');
      setLoading(true);
      // Fetches only the current page (10 users)
      const res = await axiosInstance.get(`/auth/getAllUsers?page=${pagination.page}&limit=${pagination.limit}`);
      setAllUsers(res.data.users);
    } catch (err) {
      setError('Failed to fetch all users');
    } finally {
      setLoading(false);
    }
  };

  const fetchFrequentBuyers = async () => {
    try {
      setError('');
      setLoading(true);
      // Fetches only the current page (10 buyers)
      const res = await axiosInstance.post(`/auth/buyers`,{
        page: pagination.page,
        limit: pagination.limit
      });
      setFrequentBuyers(res.data.buyers);
    } catch (err) {
      setError('Failed to fetch frequent buyers');
    } finally {
      setLoading(false);
    }
  };
  
  // --- NEW CSV Fetching Functions (Fetches full list) ---

  const fetchFullUserList = useCallback(async () => {
    setCsvLoading(true);
    try {
      // Assuming backend handles limit=all or limit=1000 to fetch everything
      const res = await axiosInstance.get(`/auth/getAllUsers?page=1&limit=1000`); 
      
      // Format data for CSV readability
      const formattedData = (res.data.users || res.data).map(u => ({
        Name: `${u.firstName || ''} ${u.lastName || ''}`,
        Email: u.email || '',
        Phone: u.phone || '',
        'Registration Date': new Date(u.createdAt).toLocaleDateString(),
      }));
      
      setAllUsersForCSV(formattedData);
      
      // Important: Return true to signal CSVLink that data is ready
      return true; 
    } catch (err) {
      setError('Failed to prepare All Users CSV.');
      return false;
    } finally {
      setCsvLoading(false);
    }
  }, []);

  const fetchFullBuyersList = useCallback(async () => {
    setCsvLoading(true);
    try {
      // Assuming backend handles fetching all buyers without pagination
      const res = await axiosInstance.post(`/auth/buyers`, { page: 1, limit: 1000 });
      
      const formattedData = (res.data.buyers || res.data).map(u => ({
        Name: `${u.firstName || u.user?.firstName} ${u.lastName || u.user?.lastName}`,
        Email: u.email || u.user?.email,
        Phone: u.phone || u.user?.phone,
        'Registration Date': new Date(u.createdAt || u.user?.createdAt).toLocaleDateString(),
        'Total Orders': u.orderCount || 0,
      }));

      setBuyersForCSV(formattedData);
      return true; 
    } catch (err) {
      setError('Failed to prepare Frequent Buyers CSV.');
      return false;
    } finally {
      setCsvLoading(false);
    }
  }, []);
  
  // --- Effects (Unchanged Logic) ---

  useEffect(() => {
    if (activeTab === 1) fetchAllUsers();
    if (activeTab === 2) fetchFrequentBuyers();
  }, [activeTab, pagination.page]);

  // --- Renderer Functions (Unchanged Logic) ---

  const renderTable = (rows) => (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="py-2 px-4">Name</th>
          <th className="py-2 px-4">Email</th>
          <th className="py-2 px-4">Phone</th>
          <th className="py-2 px-4">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((u, idx) => (
          <tr key={idx} className="border-t">
            <td className="py-2 px-4">{u.firstName || u.user?.firstName} {u.lastName || u.user?.lastName}</td>
            <td className="py-2 px-4">{u.email || u.user?.email}</td>
            <td className="py-2 px-4">{u.phone || u.user?.phone}</td>
            <td className="py-2 px-4">{new Date(u.createdAt || u.user?.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

    const renderTableBuyers = (rows) => (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="py-2 px-4">Name</th>
          <th className="py-2 px-4">Email</th>
          <th className="py-2 px-4">Phone</th>
          <th className="py-2 px-4">Date</th>
          <th className="py-2 px-4">Total Orders</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((u, idx) => (
          <tr key={idx} className="border-t">
            <td className="py-2 px-4">{u.firstName || u.user?.firstName} {u.lastName || u.user?.lastName}</td>
            <td className="py-2 px-4">{u.email || u.user?.email}</td>
            <td className="py-2 px-4">{u.phone || u.user?.phone}</td>
            <td className="py-2 px-4">{new Date(u.createdAt || u.user?.createdAt).toLocaleDateString()}</td>
            <td className="py-2 px-4">{u.orderCount}</td>

          </tr>
        ))}
      </tbody>
    </table>
  );
  
  // --- Component Render ---

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>

      <div className="flex space-x-4 mb-4">
        {TABS.map((tab, index) => (
          <button
            key={index}
            onClick={() => { setActiveTab(index); setError(''); setPagination({ ...pagination, page: 1 }); }}
            className={`px-4 py-2 rounded ${activeTab === index ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && <div className="text-blue-500 mb-4">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {activeTab === 0 && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="User ID"
              value={userQuery.userId}
              onChange={(e) => setUserQuery({ ...userQuery, userId: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Email"
              value={userQuery.email}
              onChange={(e) => setUserQuery({ ...userQuery, email: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <button onClick={fetchUser} className="bg-blue-600 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>

          {userData && (
            <div className="bg-white p-4 rounded shadow-md">
              <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
              <p><strong>Registered:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={fetchFullUserList}
              disabled={csvLoading}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-400"
            >
              {csvLoading ? 'Preparing...' : 
                <CSVLink 
                  data={allUsersForCSV} 
                  filename={`all_users_${new Date().toLocaleDateString()}.csv`} 
                  onClick={(e) => { 
                    if (allUsersForCSV.length === 0) {
                      e.preventDefault(); 
                      fetchFullUserList();
                    } 
                  }}
                >
                  <FiDownload className="inline-block mr-1" /> Download All Users
                </CSVLink>
              }
            </button>
          </div>
          {allUsers && renderTable(allUsers)}
        </div>
      )}
      
      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={fetchFullBuyersList}
              disabled={csvLoading}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-400"
            >
              {csvLoading ? 'Preparing...' : 
                <CSVLink 
                  data={buyersForCSV} 
                  filename={`frequent_buyers_${new Date().toLocaleDateString()}.csv`} 
                  onClick={(e) => { 
                    if (buyersForCSV.length === 0) {
                      e.preventDefault(); 
                      fetchFullBuyersList(); 
                    } 
                  }}
                >
                  <FiDownload className="inline-block mr-1" /> Download Buyers
                </CSVLink>
              }
            </button>
          </div>
          {frequentBuyers && renderTableBuyers(frequentBuyers)}
        </div>
      )}

      {(activeTab === 1 || activeTab === 2) && (
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={() => setPagination((p) => ({ ...p, page: Math.max(p.page - 1, 1) }))}
            disabled={pagination.page === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Prev
          </button>
          <button
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;