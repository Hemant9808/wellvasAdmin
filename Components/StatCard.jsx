// src/components/StatCard.jsx
import { FiTrendingUp, FiTrendingDown, FiShoppingBag, FiDollarSign, FiClipboard, FiUsers } from "react-icons/fi";

const icons = {
  sales: <FiShoppingBag className="text-green-600 text-2xl" />,
  income: <FiDollarSign className="text-orange-600 text-2xl" />,
  orders: <FiClipboard className="text-gray-600 text-2xl" />,
  visitors: <FiUsers className="text-blue-600 text-2xl" />,
};

export default function StatCard({ title, value, change, icon }) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
        <p className={`text-sm font-medium mt-1 ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {isPositive ? (
            <span className="inline-flex items-center">
              <FiTrendingUp className="mr-1" />
              {change}%
            </span>
          ) : (
            <span className="inline-flex items-center">
              <FiTrendingDown className="mr-1" />
              {Math.abs(change)}%
            </span>
          )}
        </p>
      </div>
      <div className="bg-gray-100 rounded-full p-3">{icons[icon]}</div>
    </div>
  );
}
