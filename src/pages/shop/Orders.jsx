// src/pages/shop/Orders.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from "../../redux/features/products/productsSlice";
import { getBaseUrl } from "../../utils/baseURL";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, currency } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a fetchOrders function that can be called multiple times
  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${getBaseUrl()}/api/orders`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
  
      const data = await response.json();
      console.log("Fetched Orders:", data);
      dispatch(setOrders(data));
      setError(null);
      return true;
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setError('Failed to load your orders. Please try again later.');
      return false;
    }
  }, [dispatch]);

  // Initial data fetch
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    
    loadOrders();
  }, [fetchOrders]);

  // Set up polling for status updates every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only refetch if not in loading state
      if (!loading) {
        fetchOrders();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchOrders, loading]);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'pending':
      default:
        return 'bg-yellow-500';
    }
  };

  // Function to get status text
  const getStatusText = (status) => {
    return status || 'Processing';
  };

  // Function to handle manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    await fetchOrders();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-xl bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="text-center text-red-600">
          <p className="text-lg mb-4">{error}</p>
          <button 
            onClick={handleRefresh} 
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col justify-center items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-lg mb-4">You haven't placed any orders yet</p>
          <a 
            href="/shop" 
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={order._id || index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-700">{order._id}</span></p>
                  <p className="text-sm text-gray-500">Placed on: <span className="font-medium text-gray-700">{formatDate(order.orderDate)}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                  <span className={`font-medium ${
                    order.status === 'Delivered' ? 'text-green-700' :
                    order.status === 'Shipped' ? 'text-blue-700' : 'text-yellow-700'
                  }`}>{getStatusText(order.status)}</span>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {order.products?.map((product, i) => (
                  <div key={`${order._id}-${i}`} className="flex py-4 border-b last:border-0">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={product.productId?.image1 || "/default-product.png"} 
                        alt={product.productId?.name || "Product"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{product.productId?.name || "Product"}</h3>
                      <div className="flex mt-1 text-sm text-gray-700">
                        <p className="mr-4">{currency} {product.productId?.price?.toFixed(2) || "0.00"}</p>
                        <p>Qty: {product.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total: <span className="text-lg font-bold">{currency} {order.totalAmount?.toFixed(2) || "0.00"}</span></p>
                </div>
                {order.status !== 'Delivered' && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">Status:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
