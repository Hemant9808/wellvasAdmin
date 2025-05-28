import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [productId, setProductId] = useState('');
  const [productStatus, setProductStatus] = useState('');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b mb-6">
        {['general', 'payment', 'product'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 border-b-2 ${
              activeTab === tab ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'general' && 'General Settings'}
            {tab === 'payment' && 'Payment Settings'}
            {tab === 'product' && 'Product Settings'}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Admin Details</h3>
            <div className="grid gap-4">
              <input type="text" placeholder="Admin Name" className="border px-3 py-2 rounded w-full" />
              <input type="email" placeholder="Admin Email" className="border px-3 py-2 rounded w-full" />
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
            </div>
          </div>

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
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold mb-4">Razorpay Settings</h3>
          <input
            type="text"
            placeholder="Razorpay Account Key"
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Razorpay Secret"
            className="border px-3 py-2 rounded w-full"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Razorpay Config</button>
        </div>
      )}

      {/* Product Settings */}
      {activeTab === 'product' && (
        <div className="bg-white p-6 rounded shadow space-y-6">
          <h3 className="text-lg font-semibold mb-4">Product Highlight Settings</h3>
          <input
            type="text"
            placeholder="Enter Product ID"
            className="border px-3 py-2 rounded w-full"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded w-full"
            value={productStatus}
            onChange={(e) => setProductStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="best-seller">Mark as Best Seller</option>
            <option value="featured">Mark as Featured</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update Product
          </button>
        </div>
      )}
    </div>
  );
}
