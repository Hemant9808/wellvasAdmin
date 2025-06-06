import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

function AdminProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: ''
  });

  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(false);

  // Fetch user data on mount (optional)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user/me'); // adjust this if your route differs
        setFormData({
          firstName: res.data?.user?.firstName || '',
          lastName: res.data?.user?.lastName || '',
          userName: res.data?.user?.userName || '',
          email: res.data?.user?.email || '',
          phone: res.data?.user?.phone || ''
        });
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const res = await axiosInstance.post('/auth/updateUserInfo', formData);
      setMessage({ type: 'success', content: 'User info updated successfully!' });
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Something went wrong';
      setMessage({ type: 'error', content: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* USER INFO */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Admin Details</h3>
        {message.content && (
          <p className={`mb-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.content}
          </p>
        )}
        <div className="grid gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Username"
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            disabled={true} // Assuming email is not editable
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className=" px-3 py-2 bg-[#bffbee] rounded w-full"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="grid gap-4">
          <input type="password" placeholder="Current Password" className="border px-3 py-2 rounded w-full" />
          <input type="password" placeholder="New Password" className="border px-3 py-2 rounded w-full" />
          <input type="password" placeholder="Confirm New Password" className="border px-3 py-2 rounded w-full" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Password</button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
