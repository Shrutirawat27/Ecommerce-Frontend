import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getBaseUrl } from '../../utils/baseURL';

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Update modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image1: null,
  });

  const currency = '$';

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${getBaseUrl()}/api/products?isAdmin=true`);
      setList(res.data.products || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeProduct = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${getBaseUrl()}/api/products/${_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product deleted");
      setList(prev => prev.filter(p => p._id !== _id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      image1: null,
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("category", formData.category);
      fd.append("price", formData.price);
      if (formData.image1) fd.append("image1", formData.image1);

      await axios.patch(
        `${getBaseUrl()}/api/products/update-product/${editingProduct._id}`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product updated");
      setEditingProduct(null);
      fetchList();
    } catch {
      toast.error("Update failed");
    }
  };

  // Categories for filter
  const categories = useMemo(() => {
    return ['all', ...new Set(list.map(p => p.category))];
  }, [list]);

  const filteredList = useMemo(() => {
    return list.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'all' || item.category === category) &&
      (minPrice === '' || item.price >= Number(minPrice)) &&
      (maxPrice === '' || item.price <= Number(maxPrice))
    );
  }, [list, search, category, minPrice, maxPrice]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <a href="/add" className="bg-green-600 text-white px-4 py-2 rounded">
          Add New
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories
            .filter(c => c !== 'all')
            .map(c => <option key={c} value={c}>{c}</option>)
          }
        </select>

        <input
          type="number"
          placeholder="Min Price"
          className="border px-3 py-2 rounded w-28"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          className="border px-3 py-2 rounded w-28"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-center">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map(item => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-center">
                  <img
                    src={item.image1}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                </td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{currency}{item.price}</td>
                <td className="px-4 py-3 text-center space-x-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => openEditModal(item)}
                  >
                    Update
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => removeProduct(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 space-y-4">
            <h2 className="font-bold text-lg">Update Product</h2>

            <input
              className="border p-2 w-full"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <input
              className="border p-2 w-full"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            />

            <input
              type="number"
              className="border p-2 w-full"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />

            <input
              type="file"
              onChange={e => setFormData({ ...formData, image1: e.target.files[0] })}
            />

            <div className="flex justify-end gap-4">
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default List;
