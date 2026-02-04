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
import { useAuthMiddleware } from '../middleware';
import OrderDetails from '../Pages/OrderDetails';
import Messages from '../Pages/Messages';
import Reviews from './pages/Reviews';
import Coupons from './pages/Coupons';
import Rewards from '../Pages/Rewards';
import InvoiceGenerator from '../Pages/InvoiceGenerator';
import OfflineCustomers from '../Pages/OfflineCustomers';
import OfflineInvoices from '../Pages/OfflineInvoices';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

// Root component that includes the auth middleware
const Root = () => {
  useAuthMiddleware();

  return <Layout />;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      // <ProtectedRoute>
      <Root />
      // </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Orders /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <Products /> },
      { path: 'customers', element: <Customers /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'analysis', element: <Analysis /> },
      { path: 'settings', element: <Settings /> },
      // { path: 'addproducts', element: <AddProduct /> },
      // { path: 'add-blogs', element: <AddBlog /> },
      { path: 'add-blogs', element: <BlogSection /> },
      { path: 'addproducts/:productId?', element: <AddProduct /> },
      { path: 'orders/:id', element: <OrderDetails /> },
      { path: 'messages', element: <Messages /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'coupons', element: <Coupons /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'generate-invoice', element: <InvoiceGenerator /> },
      { path: 'offline-customers', element: <OfflineCustomers /> },
      { path: 'offline-invoices', element: <OfflineInvoices /> },
      // { path: 'messages/:id', element: <singleMessage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
