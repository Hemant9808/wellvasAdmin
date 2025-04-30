import { useState } from 'react';

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="grid gap-4">
          <input type="text" placeholder="Name" className="border px-3 py-2 rounded w-full" />
          <input type="email" placeholder="Email" className="border px-3 py-2 rounded w-full" />
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="grid gap-4">
          <input type="password" placeholder="Current Password" className="border px-3 py-2 rounded w-full" />
          <input type="password" placeholder="New Password" className="border px-3 py-2 rounded w-full" />
          <input type="password" placeholder="Confirm New Password" className="border px-3 py-2 rounded w-full" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Password</button>
        </div>
      </div>

      {/* Notifications & Preferences */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
              className="w-4 h-4"
            />
            <span>Email Notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="w-4 h-4"
            />
            <span>Dark Mode</span>
          </label>
        </div>
      </div>
    </div>
  );
}
