import axiosInstance from './axios';

// Get all orders with pagination
export const getAllOrders = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/order/getAllOrders', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get order statistics
export const getOrderStatistics = async () => {
  try {
    const response = await axiosInstance.get('/order/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.post('/order/updateOrderStatus', {
      id: orderId,
      status
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update order payment status
export const updateOrderToPaid = async (orderData) => {
  try {
    const response = await axiosInstance.get('/order/updateOrderToPaid', {
      params: orderData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 