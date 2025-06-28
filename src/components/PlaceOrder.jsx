import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/features/cart/cartSlice';
import stripe_logo from '../assets/stripe_logo.png';
import razorpay_logo from '../assets/razorpay_logo.png';
import { getBaseUrl } from '../utils/baseURL';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, selectedItems, totalPrice, tax, grandTotal } = useSelector((store) => store.cart);
  const { currency = '$' } = useSelector((store) => store.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Current user data:", user);
    console.log("Current cart products:", products);
  }, [user, products]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
    let isValid = true;

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        errors[field] = 'This field is required';
        isValid = false;
      }
    });

    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Check if cart is empty
    if (products.length === 0) {
      alert('Your cart is empty. Please add products before placing an order.');
      return false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          alert("Please log in to place an order");
          navigate('/login');
          return;
        }

        if (!user) {
          console.error("User data is missing from Redux store");
          alert("User session appears to be invalid. Please try logging in again.");
          navigate('/login');
          return;
        }

        let userId = user?._id;
        if (!userId && user?.user && user.user._id) {
          userId = user.user._id;
        }

        if (!userId) {
          userId = localStorage.getItem("userId");
          console.log("Using userId from localStorage:", userId);
        }

        if (!userId) {
          const userFromStorage = localStorage.getItem("user");
          try {
            const parsedUser = JSON.parse(userFromStorage);
            userId = parsedUser?._id || parsedUser?.user?._id;
            console.log("Extracted userId from localStorage user object:", userId);
          } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
          }
        }

        if (!userId) {
          console.error("Cannot find valid user ID for order");
          alert("Unable to identify your account. Please log out and log in again.");
          return;
        }

        console.log("About to send order with userId:", userId);

        try {
          console.log("Attempting debug checkout first");
          const debugResponse = await fetch(`${getBaseUrl()}/api/orders/checkout-debug`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              userId,
              products: products.map(product => ({
                productId: product._id,
                quantity: product.quantity
              })),
              totalAmount: grandTotal,
              deliveryInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                address: {
                  street: formData.street,
                  city: formData.city,
                  state: formData.state,
                  zipcode: formData.zipcode,
                  country: formData.country
                },
                phone: formData.phone
              }
            })
          });
          
          const debugData = await debugResponse.json();
          // console.log("Debug checkout response:", debugData);
          
          if (!debugData.isValidObjectId) {
            console.error("Invalid user ID format detected in debug mode");
            alert("An issue with your user account was detected. Please log out and log in again.");
            return;
          }
        } catch (debugError) {
          console.error("Debug checkout failed:", debugError);
        }
        
        const orderData = {
          userId: userId,
          products: products.map(product => ({
            productId: product._id,
            quantity: product.quantity
          })),
          totalAmount: grandTotal,
          deliveryInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipcode: formData.zipcode,
              country: formData.country
            },
            phone: formData.phone
          },
          paymentMethod: method,
          status: 'Pending'
        };
        
        console.log("Sending order data:", orderData);

        const response = await fetch(`${getBaseUrl()}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        let data;
        try {
          data = await response.json();
          console.log("Order API response:", data);
        } catch (jsonError) {
          console.error("Error parsing API response:", jsonError);
          throw new Error("Invalid response from server");
        }
        
        if (response.ok) {
          dispatch(clearCart());
          alert('Order placed successfully!');
          navigate('/orders');
        } else {
          const errorMessage = data?.message || 'Unknown error';
          console.error("Order placement failed:", errorMessage);
          alert(`Failed to place order: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('An error occurred while processing your order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-6 pt-5 sm:pt-14 min-h-[80vh] px-4">
      {/* Delivery Information Section */}
      <div className="flex flex-col gap-6 w-full sm:w-[50%]">
        <div className="text-xl sm:text-2xl my-3">
          <h1>Delivery Information</h1>
        </div>
        <div className="flex gap-3">
          <div className="w-full">
            <input
              className={`border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
              type="text"
              name="firstName"
              placeholder="First name *"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
          </div>
          <div className="w-full">
            <input
              className={`border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
              type="text"
              name="lastName"
              placeholder="Last name *"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
          </div>
        </div>
        <div>
          <input
            className={`border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
        </div>
        <div>
          <input
            className={`border ${formErrors.street ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
            type="text"
            name="street"
            placeholder="Street *"
            value={formData.street}
            onChange={handleChange}
            required
          />
          {formErrors.street && <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>}
        </div>
        <div className="flex gap-3">
          <div className="w-full">
          <input
              className={`border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
            type="text"
              name="city"
              placeholder="City *"
              value={formData.city}
              onChange={handleChange}
              required
            />
            {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
          </div>
          <div className="w-full">
          <input
              className={`border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
            type="text"
              name="state"
              placeholder="State *"
              value={formData.state}
              onChange={handleChange}
              required
            />
            {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-full">
            <input
              className={`border ${formErrors.zipcode ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
              type="text"
              name="zipcode"
              placeholder="Zipcode *"
              value={formData.zipcode}
              onChange={handleChange}
              required
            />
            {formErrors.zipcode && <p className="text-red-500 text-xs mt-1">{formErrors.zipcode}</p>}
          </div>
          <div className="w-full">
          <input
              className={`border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
              type="text"
              name="country"
              placeholder="Country *"
              value={formData.country}
              onChange={handleChange}
              required
            />
            {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
          </div>
        </div>
        <div>
          <input
            className={`border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded py-1.5 px-3.5 w-full`}
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="flex flex-col gap-6 w-full sm:w-[45%] mt-20 sm:mt-0">
        <div className="order-summary bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="summary-item flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Selected Items:</span>
            <span className="font-medium">{selectedItems}</span>
          </div>
          <div className="summary-item flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total Price:</span>
            <span className="font-medium">{currency}{totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-item flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Tax (5%):</span>
            <span className="font-medium">{currency}{tax.toFixed(2)}</span>
          </div>
          <div className="summary-item flex justify-between items-center border-t-2 pt-3 mt-3">
            <span className="text-sm text-gray-600">Grand Total:</span>
            <span className="font-medium text-xl">{currency}{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-12">
          <h1>Payment Method</h1>
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod('stripe')}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'stripe' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h-5 mx-4" src={stripe_logo} alt="stripe" />
            </div>
            <div
              onClick={() => setMethod('razorpay')}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h-5 mx-4" src={razorpay_logo} alt="razorpay" />
            </div>
            <div
              onClick={() => setMethod('cod')}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Cash On Delivery
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className={`bg-black text-white px-16 py-3 text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;