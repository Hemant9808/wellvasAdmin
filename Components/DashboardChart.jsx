// src/components/DashboardChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", revenue: 400 },
  { name: "Tue", revenue: 700 },
  { name: "Wed", revenue: 200 },
  { name: "Thu", revenue: 1000 },
  { name: "Fri", revenue: 900 },
  { name: "Sat", revenue: 400 },
  { name: "Sun", revenue: 300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2 rounded shadow text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">Revenue: ₹{payload[0].value}</p>
      </div>
    );
  }

  return null;
};

export default function DashboardChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Weekly Revenue</h3>
      <p className="text-sm text-gray-500 mb-4">Sales performance over the last 7 days</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
