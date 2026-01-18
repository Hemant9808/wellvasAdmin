/// <reference types="vite/client" />

import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const baseURL = import.meta.env.VITE_API_URL || 'https://ayucan.in';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('authStorage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;