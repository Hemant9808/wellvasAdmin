import { useState } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import { CSVLink } from 'react-csv';

const dummyCustomers = [
  { id: 1, name: 'Ravi Sharma', email: 'ravi@example.com', orders: 3, totalSpent: '₹1397' },
  { id: 2, name: 'Ananya Mehta', email: 'ananya@example.com', orders: 1, totalSpent: '₹499' },
  { id: 3, name: 'Vikram Rao', email: 'vikram@example.com', orders: 5, totalSpent: '₹2197' },
  { id: 4, name: 'Pooja Singh', email: 'pooja@example.com', orders: 2, totalSpent: '₹1398' },
  { id: 5, name: 'Amit Joshi', email: 'amit@example.com', orders: 4, totalSpent: '₹1896' },
  { id: 6, name: 'Nidhi Verma', email: 'nidhi@example.com', orders: 2, totalSpent: '₹998' },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = dummyCustomers.filter((cust) =>
    cust.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search customers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-full md:w-64"
          />
        </div>
        <CSVLink
          data={filtered}
          filename="customers.csv"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <FiDownload /> Download CSV
        </CSVLink>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border rounded shadow bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">ID</th>
              <th className="text-left p-2 border">Name</th>
              <th className="text-left p-2 border">Email</th>
              <th className="text-left p-2 border">Orders</th>
              <th className="text-left p-2 border">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((cust) => (
              <tr key={cust.id} className="hover:bg-gray-50">
                <td className="p-2 border">{cust.id}</td>
                <td className="p-2 border">{cust.name}</td>
                <td className="p-2 border">{cust.email}</td>
                <td className="p-2 border">{cust.orders}</td>
                <td className="p-2 border">{cust.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              i + 1 === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
