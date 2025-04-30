// src/pages/Dashboard.jsx
// import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import StatCard from "../Components/StatCard";
import DashboardChart from "../Components/DashboardChart";
import TopProducts from "../Components/TopProducts";
// import TopCountries from "../Components/TopCountries";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6">
        <Navbar />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard title="Total Sales" value="₹34,945" change={1.56} icon="sales" />
          <StatCard title="Total Income" value="₹37,802" change={-1.56} icon="income" />
          <StatCard title="Orders Paid" value="34,945" change={0.0} icon="orders" />
          <StatCard title="Total Visitors" value="34,945" change={1.56} icon="visitors" />
        </div>

        {/* Chart and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <DashboardChart />
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <TopProducts />
          </div>
        </div>

      </div>
    </div>
  );
}
