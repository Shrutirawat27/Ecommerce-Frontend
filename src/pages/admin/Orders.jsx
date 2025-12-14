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
            
            const sortedOrders = response.data.sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

setOrders(sortedOrders);

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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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
                <>
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
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
                                        <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="status-dropdown relative">
                                                <select 
                                                    className={`appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 leading-tight focus:outline-none focus:border-blue-500 ${isUpdating === order._id ? 'opacity-70' : ''}`}
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    disabled={isUpdating === order._id}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    {isUpdating === order._id ? (
                                                        <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">Order ID: <span className="text-gray-600">{order._id.substring(0, 8)}...</span></h3>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <p><span className="font-medium">Customer:</span> {order.deliveryInfo?.firstName || order.userId?.name || "Unknown"}</p>
                                        <p className="text-sm text-gray-500">{order.deliveryInfo?.email}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Products:</p>
                                        <ul className="list-disc pl-5">
                                            {order.products.map((product, idx) => (
                                                <li key={idx} className="text-sm">
                                                    {product.productId?.name || "Product"} x {product.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                                        <p className="font-bold">Total: {currency}{order.totalAmount.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor={`status-${order._id}`} className="block text-sm font-medium text-gray-700 mb-1">Update Status:</label>
                                        <div className="status-dropdown relative">
                                            {/* Corrected mobile dropdown styling */}
                                            <select 
                                                id={`status-${order._id}`}
                                                className={`appearance-none bg-white border border-gray-300 rounded-md px-2 py-1 pr-6 leading-tight focus:outline-none focus:border-blue-500 ${isUpdating === order._id ? 'opacity-70' : ''}`}
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                disabled={isUpdating === order._id}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                {isUpdating === order._id ? (
                                                    <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Orders;