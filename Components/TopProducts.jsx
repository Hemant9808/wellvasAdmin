// src/components/TopProducts.jsx
export default function TopProducts() {
  const products = [
    { name: 'Gokshura', unitsSold: 320, percentage: 28 },
    { name: 'Shilajit Resin', unitsSold: 270, percentage: 24 },
    { name: 'Ashwagandha', unitsSold: 210, percentage: 18 },
    { name: 'Protein Bar', unitsSold: 150, percentage: 14 },
    { name: 'Wellness Capsules', unitsSold: 100, percentage: 9 },
    { name: 'Herbal Tea', unitsSold: 80, percentage: 7 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium text-gray-700">{product.name}</p>
              <p className="text-sm text-gray-500">{product.unitsSold} units sold</p>
            </div>
            <span className="text-sm font-semibold text-green-600">{product.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
