import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiChevronRight,
  FiChevronLeft,
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiShoppingCart,
  FiFileText,
} from "react-icons/fi";
import { getUser } from "../utils/getUser";

const Layout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const userData = getUser();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  const menuItems = [
    { path: "/", icon: <FiShoppingCart />, label: "Dashboard" },
    { path: "/products", icon: <FiShoppingBag />, label: "Products" },
    { path: "/customers", icon: <FiUsers />, label: "Customers" },
    { path: "/add-blogs", icon: <FiFileText />, label: "Blogs" },
    // { path: '/analysis', icon: <FiBarChart2 />, label: 'Analysis' },
    { path: "/addproducts", icon: <FiPackage />, label: "Add Product" },
    { path: "/messages", icon: <FiPackage />, label: "Messages" },
    { path: "/reviews", icon: <FiPackage />, label: "Reviews" },
    { path: "/coupons", icon: <FiPackage />, label: "Coupons" },
    { path: "/settings", icon: <FiSettings />, label: "Settings" },
    { path: "/generate-invoice", icon: <FiSettings />, label: "Generate Invoice" },
  ];

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {isExpanded && (
          <h1 className="text-xl font-bold text-gray-800">Ayucan Admin</h1>
        )}
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setIsMobileOpen(false);
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
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

      {/* Footer */}
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          {isExpanded && (
            <div className="  gap-2 ml-3 flex justify-between w-full">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {userData?.firstName || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {userData?.email || "user@example.com"}
                </p>
              </div>
              <div className="ml-3 bg-red-400 text-white p-1 rounded-lg cursor-pointer  transition-colors">
                <button
                  onClick={() => {
                    localStorage.removeItem("authStorage");
                    localStorage.removeItem("token");
                    window.location.reload();
                    navigate("/login", { replace: true });
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
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full bg-white shadow-lg transition-transform duration-300 w-64 md:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent />
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-white shadow-lg transition-all duration-300 ${isExpanded ? "w-64" : "w-20"
          }`}
      >
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar for mobile */}
        <div className="md:hidden bg-white shadow p-4">
          <button onClick={() => setIsMobileOpen(true)}>
            <FiMenu className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* Outlet renders routed content */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
