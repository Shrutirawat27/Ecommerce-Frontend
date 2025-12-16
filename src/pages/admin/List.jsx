import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getBaseUrl } from '../../utils/baseURL';

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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

  const categories = useMemo(
    () => ['all', ...new Set(list.map(p => p.category))],
    [list]
  );

  const filteredList = useMemo(() => {
    return list.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'all' || item.category === category) &&
      (minPrice === '' || item.price >= Number(minPrice)) &&
      (maxPrice === '' || item.price <= Number(maxPrice))
    );
  }, [list, search, category, minPrice, maxPrice]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-2xl font-bold mb-4">All Products</h1>

{/* Filters */}
<div className="mb-6 space-y-4">

  {/* ===== MOBILE FILTERS ===== */}
  <div className="md:hidden space-y-4">

    {/* Search + Category */}
    <div className="grid grid-cols-2 gap-3">
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Search by name"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />
      <select
        className="border px-3 py-2 rounded w-full"
        value={category}
        onChange={e => {
          setCategory(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="all">All Categories</option>
        {categories.filter(c => c !== 'all').map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    {/* Min + Max Price */}
    <div className="grid grid-cols-2 gap-3">
      <input
        type="number"
        placeholder="Min Price"
        className="border px-3 py-2 rounded w-full"
        value={minPrice}
        onChange={e => {
          setMinPrice(e.target.value);
          setCurrentPage(1);
        }}
      />
      <input
        type="number"
        placeholder="Max Price"
        className="border px-3 py-2 rounded w-full"
        value={maxPrice}
        onChange={e => {
          setMaxPrice(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  </div>

  {/* ===== DESKTOP FILTERS (UNCHANGED ORIGINAL) ===== */}
  <div className="hidden md:flex flex-wrap gap-4">
    <input
      className="border px-3 py-2 rounded"
      placeholder="Search by name"
      value={search}
      onChange={e => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />
    <select
      className="border px-3 py-2 rounded"
      value={category}
      onChange={e => {
        setCategory(e.target.value);
        setCurrentPage(1);
      }}
    >
      <option value="all">All Categories</option>
      {categories.filter(c => c !== 'all').map(c => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
    <input
      type="number"
      placeholder="Min Price"
      className="border px-3 py-2 rounded w-40"
      value={minPrice}
      onChange={e => {
        setMinPrice(e.target.value);
        setCurrentPage(1);
      }}
    />
    <input
      type="number"
      placeholder="Max Price"
      className="border px-3 py-2 rounded w-40"
      value={maxPrice}
      onChange={e => {
        setMaxPrice(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>

</div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {paginatedList.map(item => (
          <div key={item._id} className="bg-white shadow rounded p-4 flex gap-4">
            <img
              src={item.image1}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.category}</p>
              <p className="font-semibold mt-1">
                {currency}{item.price}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <button
                  className="text-blue-600"
                  onClick={() => openEditModal(item)}
                >
                  Update
                </button>
                <button
                  className="text-red-600"
                  onClick={() => removeProduct(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE (UNCHANGED) */}
      <div className="hidden md:block bg-white shadow rounded overflow-x-auto">
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
            {paginatedList.map(item => (
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
                  : 'bg-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded p-4 md:p-6 w-full max-w-sm md:max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
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
            <div className="flex justify-end gap-4 pt-2">
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
