import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getBaseUrl } from '../../utils/baseURL';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [image1, setImage1] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("Accessories");
  const [color, setColor] = useState("Black");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error("You need admin access to add products");
      navigate('/'); 
    }
  }, [user, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    
    if (!image1) {
      toast.error("Product image is required");
      return;
    }

    if (!user || user.role !== 'admin') {
      toast.error("Admin privileges required");
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("oldPrice", oldPrice || 0);
      formData.append("category", category);
      formData.append("color", color);
      formData.append("image1", image1);

      // console.log("Sending product data to server:");
      // console.log("Name:", name);
      // console.log("Price:", price);
      // console.log("Category:", category);
      // console.log("Image:", image1 ? image1.name : "No image");

      const response = await axios.post(
        `${getBaseUrl()}/api/products/create-product`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
      
      // console.log("Server response:", response);
      
      if (response.data && response.data._id) {
        toast.success("Product added successfully!");
        setName('');
        setDescription('');
        setImage1(null);
        setPrice('');
        setOldPrice('');
        setTimeout(() => {
          navigate('/list-items');
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        const errorMessage = error.response.data?.message || error.response.data?.error || "Server error";
        toast.error(`Failed to add product: ${errorMessage}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <h3 className="text-lg font-medium">Admin Access Required</h3>
          <p>You need administrator privileges to add products.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 bg-white rounded-lg shadow-md p-6'>
        <div>
          <p className='mb-2'>Upload Image <span className="text-red-500">*</span></p>
          <div className='flex gap-2'>
            <label htmlFor='image1' className="cursor-pointer">
              <img className='w-20 h-20 object-cover border' src={!image1 ? '/upload.png' : URL.createObjectURL(image1)} alt='' />
              <input onChange={(e) => setImage1(e.target.files[0])} type='file' id='image1' hidden accept="image/*" />
            </label>
            {image1 && <p className="text-sm text-gray-600 self-end">{image1.name}</p>}
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product Name <span className="text-red-500">*</span></p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full border border-gray-300 rounded-md px-4 py-2' type='text' placeholder='Type here' required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product Description <span className="text-red-500">*</span></p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full border border-gray-300 rounded-md px-4 py-2 h-24' placeholder='Write content here' required />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
          <div>
            <p className='mb-2'>Product Category <span className="text-red-500">*</span></p>
            <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full border border-gray-300 rounded-md px-4 py-2'>
              <option value="Accessories">Accessories</option>
              <option value="Dresses">Dresses</option>
              <option value="Footwears">Footwears</option>
              <option value="Cosmetics">Cosmetics</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Product Price <span className="text-red-500">*</span></p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full border border-gray-300 rounded-md px-4 py-2' type='number' placeholder='25' required min="0" step="0.01" />
          </div>

          <div>
            <p className='mb-2'>Product Old Price</p>
            <input onChange={(e) => setOldPrice(e.target.value)} value={oldPrice} className='w-full border border-gray-300 rounded-md px-4 py-2' type='number' placeholder='25' min="0" step="0.01" />
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product Color</p>
          <select onChange={(e) => setColor(e.target.value)} value={color} className='w-full border border-gray-300 rounded-md px-4 py-2'>
            <option value="Black">Black</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
            <option value="Beige">Beige</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Pink">Pink</option>
            <option value="Orange">Orange</option>
            <option value="Yellow">Yellow</option>
            <option value="Brown">Brown</option>
            <option value="White">White</option>
            <option value="Purple">Purple</option>
            <option value="Gray">Gray</option>
          </select>
        </div>

        <button 
          type='submit' 
          className={`w-28 py-3 mt-4 bg-primary hover:!bg-primary-dark text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default Add; 