import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getBaseUrl } from '../../utils/baseURL';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  const currency = '$';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await axios.get(`${getBaseUrl()}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setOrders(response.data);
      console.log("Admin orders:", response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. " + (err.response?.data?.message || err.message));
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setIsUpdating(orderId);
      const token = localStorage.getItem('token');
      const apiUrl = getBaseUrl() + '/api/orders/' + orderId;
      
      // console.log(`Updating order ${orderId} to status: ${newStatus}`);
      // console.log(`API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setOrders(orders.map(order => 
        order._id === orderId ? {...order, status: newStatus} : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status: " + err.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-200 text-green-800';
      case 'Shipped':
        return 'bg-blue-200 text-blue-800';
      case 'Pending':
      default:
        return 'bg-yellow-200 text-yellow-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Orders</h1>
        <button 
          onClick={() => fetchOrders()} 
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
          disabled={loading}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Products</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{order._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">
                    {order.deliveryInfo ? (
                      <div>
                        <p>{order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
                        <p className="text-xs text-gray-500">{order.deliveryInfo.email}</p>
                      </div>
                    ) : (
                      <p>{order.userId?.name || "Unknown"}</p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {order.products.map((product, idx) => (
                      <div key={idx} className="mb-1">
                        <p>
                          {product.productId?.name || "Product"} x {product.quantity}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 font-medium">{currency}{order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">{formatDate(order.orderDate)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="status-dropdown">
                      <select 
                        className={`${isUpdating === order._id ? 'opacity-70' : ''}`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={isUpdating === order._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <div className="dropdown-icon">
                        {isUpdating === order._id ? (
                          <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders; 