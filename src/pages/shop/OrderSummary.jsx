import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../../redux/features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ onCloseCart }) => {
  const dispatch = useDispatch()
  const products = useSelector((store) => store.cart.products);
  const {selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector((store) => store.cart);
  const navigate = useNavigate();
  
  const handleClearCart = () => {
    dispatch(clearCart())
  };

  const handleProceedCheckout = () => {
    if (onCloseCart) onCloseCart(); 
    navigate("/place-order");       
  };
  

  return (
    <div className="bg-primary-light mt-5 rounded text-base">
        <div className="px-6 py-4 space-y-5">
            <h2 className="text-xl text-text-dark">Order Summary</h2>
            <p className="text-text-dark mt-2">Selected Items: {selectedItems}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <p>Tax ({taxRate * 100}%): ${tax.toFixed(2)}</p>
            <h3 className="font-bold">Grand Total: <span className="grand-total">${grandTotal.toFixed(2)}</span></h3>
            <div className="px-0 mb-6">
                <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearCart();
                }}
                  className="bg-red-500 px-3 py-1.5 text-black mt-2 rounded-md flex justify-between items-center mb-4">
                  <span className="mr-2">Clear Cart </span>
                <img src="/trash.png" alt="Delete" className="w-5 h-5"/>
                </button>

                <button 
                  onClick={handleProceedCheckout}
                  className="bg-green-600 px-3 py-2 text-black mt-2 rounded-md flex justify-between items-center mb-4">
                  <span className="mr-2">Proceed Checkout</span>
                  <img src="/credit-card.png" alt="Card" className="w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default OrderSummary
