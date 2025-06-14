// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronRight, FiChevronLeft, FiHome, FiShoppingBag, FiUsers, FiPackage, FiBarChart2, FiSettings, FiShoppingCart, FiFileText } from 'react-icons/fi';
import { getUser } from '../utils/getUser';

const Layout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const userData= getUser();

  console.log("userData",userData)
 
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    // { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/', icon: <FiShoppingCart />, label: 'Dashboard' },
    { path: '/products', icon: <FiShoppingBag />, label: 'Products' },
    { path: '/customers', icon: <FiUsers />, label: 'Customers' },
    // { path: '/inventory', icon: <FiPackage />, label: 'Inventory' },
    { path: '/add-blogs', icon: <FiFileText />, label: 'Blogs' },
    { path: '/analysis', icon: <FiBarChart2 />, label: 'Analysis' },
    { path: '/addproducts', icon:<FiPackage /> , label: 'Add Product' },
    { path: '/messages', icon:<FiPackage /> , label: 'Messages' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },

  ];

  return (
    <div className="flex overflow-hidden max-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isExpanded && (
            <h1 className="text-xl font-bold text-gray-800">Wellvas Admin</h1>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  {isExpanded && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="bottom-0 mt-[5rem] p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {isExpanded && (
              <div className="ml-3 flex ">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-700">{userData?.firstName || 'User'}</p>
                <p className="text-xs text-gray-500">{userData?.email || 'user@example.com'}</p>
              </div>
                 <div className="ml-3 bg-red-400 text-white p-1 rounded-lg cursor-pointer  transition-colors">
                  <button
                    onClick={() => {
                      localStorage.removeItem('authStorage');
                      localStorage.removeItem('token');
                      window.location.reload();
                      navigate('/login', { replace: true });
                    }}
                    className=" cursor-pointer text-sm"
                  >
                    Logout
                  </button> 
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
