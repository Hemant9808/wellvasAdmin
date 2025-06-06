// import React, { useEffect } from 'react'
// import axiosInstance from '../utils/axios';
// import { useParams } from 'react-router-dom';

// function OrderDetails() {

// //oderId from parmas
// const { id } = useParams(); 
// console.log("id", id);


//     const fetchOrderDetails = async () => {
//         try {
//             const response = await axiosInstance(`/order/${id}`);
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             console.log("order details", data);
//         } catch (error) {
//             console.error('There was a problem with the fetch operation:', error);
//         }
//     }


//     useEffect(() => {

// fetchOrderDetails(); 
      
//     }, []);
//   return (
//     <div>
//       oder detials
//     </div>
//   )
// }

// export default OrderDetails



import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';

function OrderDetails() {
    const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderDetails = async () => {
    try {
      const response = await axiosInstance.get(`/order/${id}`);
      setOrder(response.data);
    } catch (error) {
      setError('Failed to load order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) return <div className="p-4 text-center text-lg">Loading...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      
      <button onClick={()=>{navigate('/')}} className = "bg-[#7bf249] p-2 px-4 cursor-pointer rounded text-white ">Back</button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Order ID:</strong> {order?._id}</p>
          <p><strong>Status:</strong> {order?.orderStatus}</p>
          <p><strong>Payment Method:</strong> {order?.paymentResult?.paymentMethod}</p>
          <p><strong>Payment Status:</strong> {order?.paymentResult?.paymentStatus}</p>
          <p><strong>Total Price:</strong> ₹{order?.totalPrice}</p>
          <p><strong>Shipping Price:</strong> ₹{order?.shippingPrice}</p>
        </div>
        <div>
          <p><strong>Delivered:</strong> {order?.isDelivered ? 'Yes' : 'No'}</p>
          <p><strong>Created At:</strong> {new Date(order?.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(order?.updatedAt).toLocaleString()}</p>
          <p><strong>Razorpay Order ID:</strong> {order?.razorpay_order_id || 'N/A'}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium mt-6 mb-2">Shipping Address</h3>
        <p>{order?.shippingAddress?.address}, {order?.shippingAddress?.city}</p>
      </div>

      <div>
        <h3 className="text-xl font-medium mt-6 mb-2">User Info</h3>
        <p><strong>User ID:</strong> {order?.user?._id}</p>
        <p><strong>Email:</strong> {order?.user?.email}</p>
      </div>

      <div>
        <h3 className="text-xl font-medium mt-6 mb-2">Items</h3>
        {order?.items?.map((item, idx) => (
          <div key={idx} className="p-4 border rounded-md mb-2 bg-gray-50">
            <p><strong>Product Name:</strong> {item?.productId?.name || 'Unknown Product'}</p>
            <p><strong>Brand:</strong> {item?.productId?.brand || 'N/A'}</p>
            <p><strong>Price:</strong> ₹{item?.price}</p>
            <p><strong>Quantity:</strong> {item?.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetails;
