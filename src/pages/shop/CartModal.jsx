import React from 'react';
import OrderSummary from './OrderSummary';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';

const CartModal = ({ products, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleQuantity = (type, _id) => {
    dispatch(updateQuantity({ type, _id }));
  };

  const handleRemove = (e, _id) => {
    e.preventDefault();
    dispatch(removeFromCart({ _id }));
  };

  return (
    <div
      className={`fixed z-[1000] inset-0 bg-black/80 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

      <div
        className={`fixed right-0 top-0 md:w-1/3 w-full bg-white h-full overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-semibold">Your Cart</h4>
            
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close Cart">
              <img src="/close.png" alt="Close" className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="cart-items">
            {products.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
            ) : (
              products.map((item, index) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between shadow-sm md:p-5 p-2 mb-4 border rounded-md">
                  <div className="flex items-center">
                    <span className="mr-4 px-2 bg-primary text-white rounded-full text-sm font-semibold">
                      0{index + 1}
                    </span>
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-12 h-12 object-cover mr-4 rounded"
                    />
                    <div>
                      <h5 className="text-sm font-medium">{item.name}</h5>
                      <p className="text-gray-600 text-sm">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end md:mt-0 mt-4 gap-2">
                    <button
                      onClick={() => handleQuantity('decrement', item._id)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-primary hover:text-white text-gray-700">
                      −
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity('increment', item._id)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-primary hover:text-white text-gray-700">
                      +
                    </button>
                    <button
                      onClick={(e) => handleRemove(e, item._id)}
                      className="text-red-500 hover:text-red-700 ml-2 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {products.length > 0 && <OrderSummary onCloseCart={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default CartModal;