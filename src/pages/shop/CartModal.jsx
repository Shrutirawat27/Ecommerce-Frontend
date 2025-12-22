import React from 'react';
import OrderSummary from './OrderSummary';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, updateCartBackend } from '../../redux/features/cart/cartSlice';

const CartModal = ({ products, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleQuantity = (type, _id) => {
    dispatch(updateQuantity({ type, _id }));
    dispatch(updateCartBackend()); 
  };

  const handleRemove = (e, _id) => {
    e.preventDefault();
    dispatch(removeFromCart({ _id }));
    dispatch(updateCartBackend());
  };

  return (
    <div
      className={`fixed z-[1000] inset-0 bg-black/80 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`fixed right-0 top-0 w-full max-w-[450px] bg-white h-full overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-gray-800">Your Cart</h4>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close Cart"
            >
              <img src="/close.png" alt="Close" className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Your cart is empty.</p>
              </div>
            ) : (
              products.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-start gap-4 p-4 border rounded-xl shadow-sm bg-white"
                >
                  {/* Index Badge */}
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-[10px] font-bold mt-1">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>

                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover flex-shrink-0 rounded-lg border border-gray-100"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-gray-800 truncate mb-1">
                      {item.name}
                    </h5>
                    <p className="text-primary font-bold text-sm mb-3">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 px-2 py-1">
                        <button
                          onClick={() => handleQuantity('decrement', item._id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white border hover:bg-primary hover:text-white transition-colors text-gray-800"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantity('increment', item._id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white border hover:bg-primary hover:text-white transition-colors text-gray-600"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={(e) => handleRemove(e, item._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {products.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <OrderSummary onCloseCart={onClose} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;