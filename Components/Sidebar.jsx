// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-md z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 md:translate-x-0 md:static md:block`}
    >
      <div className="flex items-center justify-between p-4 md:hidden">
        <h2 className="text-xl font-bold">Ayucan Admin</h2>
        <button onClick={toggleSidebar} className="text-gray-700 text-2xl">
          &times;
        </button>
      </div>
      <ul className="space-y-4 p-4">
        <li>
          <Link to="/" className="text-gray-700 hover:text-black block">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/orders" className="text-gray-700 hover:text-black block">
            Orders
          </Link>
        </li>
        <li>
          <Link to="/products" className="text-gray-700 hover:text-black block">
            Products
          </Link>
        </li>
        <li>
          <Link to="/inventory" className="text-gray-700 hover:text-black block">
            Inventory
          </Link>
        </li>
        <li>
          <Link to="/analysis" className="text-gray-700 hover:text-black block">
            Analytics
          </Link>
        </li>
        <li>
          <Link to="/addproducts" className="text-gray-700 hover:text-black block">
            Add Products
          </Link>
        </li>
        <li>
          <Link to="/messages" className="text-gray-700 hover:text-black block">
            Messages
          </Link>
        </li>
        <li>
          <Link to="/reviews" className="text-gray-700 hover:text-black block">
            Reviews
          </Link>
        </li>
        <li>
          <Link to="/rewards" className="text-gray-700 hover:text-black block">
            Rewards
          </Link>
        </li>
        <li>
          <Link to="/add-blogs" className="text-gray-700 hover:text-black block">
            Add Blogs
          </Link>
        </li>
        <li>
          <Link to="/settings" className="text-gray-700 hover:text-black block">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}
