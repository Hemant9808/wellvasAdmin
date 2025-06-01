// src/App.jsx
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Layout from '../Components/Layout';
import Dashboard from '../Pages/Dashboard';
import Orders from '../pages/OrdersPage';
import Products from '../pages/ProductsPage';
import Customers from '../pages/CustomersPage';
import Inventory from '../pages/InventoryPage';
import Analysis from '../pages/AnalyticsPage';
//@ts-ignore
import Settings from '../pages/SettingsPage';

import AddBlog from '../Pages/AddBlog';
import AddProduct from '../Pages/AddProduct';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Layout includes Sidebar + Outlet
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'orders', element: <Orders /> },
      { path: 'products', element: <Products /> },
      { path: 'customers', element: <Customers /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'analysis', element: <Analysis /> },
      { path: 'settings', element: <Settings /> },
      // { path: 'addproducts', element: <AddProducts /> },
      { path: 'add-blogs', element: <AddBlog /> },
      { path: 'addproducts', element: <AddProduct /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
