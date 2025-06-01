// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="text-gray-700 hover:text-black block">Dashboard</Link>
        </li>
        <li>
          <Link to="/orders" className="text-gray-700 hover:text-black block">Orders</Link>
        </li>
        <li>
          <Link to="/products" className="text-gray-700 hover:text-black block">Products</Link>
        </li>
        {/* <li>
          <Link to="/customers" className="text-gray-700 hover:text-black block">Customers</Link>
        </li> */}
        <li>
          <Link to="/inventory" className="text-gray-700 hover:text-black block">Inventory</Link>
        </li>
        <li>
          <Link to="/analysis" className="text-gray-700 hover:text-black block">Analatics</Link>
        </li>
        <li>
          <Link to="/settings" className="text-gray-700 hover:text-black block">Settings</Link>
        </li>
        <li>
          <Link to="/add-blogs" className="text-gray-700 hover:text-black block">Add Blogs</Link>
        </li>
        <li>
          <Link to="/addproducts" className="text-gray-700 hover:text-black block">Add Products</Link>
        </li>
        <li className="text-gray-700 hover:text-black cursor-pointer">Users</li>
      </ul>
    </div>
  );
}
