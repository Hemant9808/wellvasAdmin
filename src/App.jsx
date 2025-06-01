// src/App.jsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import Layout from '../Components/Layout';
import Dashboard from '../Pages/Dashboard';
import Orders from '../Pages/OrdersPage';
import Products from '../Pages/ProductsPage';
import Customers from '../Pages/CustomersPage';
import Inventory from '../Pages/InventoryPage';
import Analysis from '../Pages/AnalyticsPage';
//@ts-ignore
import Settings from '../Pages/SettingsPage';

import AddBlog from '../Pages/AddBlog';
import AddProduct from '../Pages/AddProduct';
import BlogSection from '../Pages/Blogs/BlogSection';
import LoginPage from '../Pages/LoginPage';
import useAuthStore from '../utils/authStore';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'orders', element: <Orders /> },
      { path: 'products', element: <Products /> },
      { path: 'customers', element: <Customers /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'analysis', element: <Analysis /> },
      { path: 'settings', element: <Settings /> },
      // { path: 'addproducts', element: <AddProducts /> },
      // { path: 'add-blogs', element: <AddBlog /> },
      { path: 'add-blogs', element: <BlogSection /> },
      { path: 'addproducts', element: <AddProduct /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
