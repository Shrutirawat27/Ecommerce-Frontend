import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getBaseUrl } from '../../utils/baseURL';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateDesc');
  const [currentPage, setCurrentPage] = useState(1);

  const ORDERS_PER_PAGE = 5;
  const currency = '$';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const res = await axios.get(`${getBaseUrl()}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(res.data);
    } catch (err) {
      setError('Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setIsUpdating(orderId);
      const token = localStorage.getItem('token');

      const res = await fetch(`${getBaseUrl()}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Update failed');

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(search) ||
      order.deliveryInfo?.firstName?.toLowerCase().includes(search) ||
      order.deliveryInfo?.lastName?.toLowerCase().includes(search) ||
      order.deliveryInfo?.email?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortOption) {
      case 'dateAsc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'dateDesc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'totalAsc':
        return a.totalAmount - b.totalAmount;
      case 'totalDesc':
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const formatDate = date =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getStatusClass = status => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-200 text-green-800';
      case 'Shipped':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-yellow-200 text-yellow-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-2xl font-bold mb-4">Customer Orders</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Order / Customer / Email"
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}>
          <option value="dateDesc">Date: Newest</option>
          <option value="dateAsc">Date: Oldest</option>
          <option value="totalDesc">Total: High → Low</option>
          <option value="totalAsc">Total: Low → High</option>
        </select>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedOrders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded shadow space-y-3">
            <p className="text-xs font-mono break-all">{order._id}</p>

            <div>
              <p className="font-semibold">
                {order.deliveryInfo?.firstName} {order.deliveryInfo?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {order.deliveryInfo?.email}
              </p>
            </div>

            <div className="space-y-2">
              {order.products?.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <img
                    src={item.productId?.image1}
                    alt={item.productId?.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {item.productId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold">
                {currency}{order.totalAmount.toFixed(2)}
              </p>
              <select
                value={order.status}
                disabled={isUpdating === order._id}
                onChange={e =>
                  updateOrderStatus(order._id, e.target.value)
                }
                className={`px-2 py-1 rounded text-xs ${getStatusClass(order.status)}`}>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <p className="text-xs text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => (
              <tr key={order._id} className="border-b align-top">
                <td className="px-4 py-3 font-mono text-xs break-all">
                  {order._id}
                </td>

                <td className="px-4 py-3">
                  <p className="font-medium">
                    {order.deliveryInfo?.firstName} {order.deliveryInfo?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.deliveryInfo?.email}
                  </p>
                </td>

                <td className="px-4 py-3 space-y-2">
                  {order.products?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <img
                        src={item.productId?.image1}
                        alt={item.productId?.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {item.productId?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {currency}{order.totalAmount.toFixed(2)}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    disabled={isUpdating === order._id}
                    onChange={e =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className={`px-2 py-1 rounded text-xs ${getStatusClass(order.status)}`}>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;