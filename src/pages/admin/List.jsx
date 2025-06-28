import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getBaseUrl } from '../../utils/baseURL';

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = '$';

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${getBaseUrl()}/api/products?isAdmin=true`);
      console.log("API Response:", response.data);
  
      if (response.data.products) {
        setList(response.data.products);
      } else {
        toast.error("No products found!");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await axios.delete(`${getBaseUrl()}/api/products/${_id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
  
      if (response.status === 200) {
        toast.success(response.data.message || "Product deleted successfully");
  
        setList((prevList) => prevList.filter((item) => item._id !== _id));
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "An error occurred while deleting the product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) return <div className="text-center py-8">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products List</h1>
        <a href="/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add New Product</a>
      </div>
      
      {list.length === 0 ? (
        <p className="text-center py-8">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img 
                      src={item.image1 || '/fallback-image.png'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">{currency}{item.price?.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
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

export default List; 