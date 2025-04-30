import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 10000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 12000 },
  { month: 'Apr', revenue: 18000 },
  { month: 'May', revenue: 22000 },
  { month: 'Jun', revenue: 19500 },
];

const orderData = [
  { day: 'Mon', orders: 40 },
  { day: 'Tue', orders: 35 },
  { day: 'Wed', orders: 50 },
  { day: 'Thu', orders: 30 },
  { day: 'Fri', orders: 55 },
  { day: 'Sat', orders: 70 },
  { day: 'Sun', orders: 45 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h3 className="text-2xl font-semibold text-green-600">₹1,25,000</h3>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h3 className="text-2xl font-semibold text-blue-600">820</h3>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-sm text-gray-500">Customers</p>
          <h3 className="text-2xl font-semibold text-purple-600">560</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold mb-2">Monthly Revenue</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold mb-2">Orders This Week</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
