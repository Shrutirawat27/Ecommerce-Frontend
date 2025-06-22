import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../features/products/productsSlice";

const OrderPlacement = () => {
  const dispatch = useDispatch();
  const existingOrders = useSelector((state) => state.products.orders); // Get existing orders

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const orderData = {
      userId,
      products: [
        { name: "Product 1", price: 100, image1: ["image_url1"], quantity: 1 },
        { name: "Product 2", price: 150, image1: ["image_url2"], quantity: 2 },
      ],
      totalAmount: 100 * 1 + 150 * 2,
      status: "Pending",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log("API Response:", data); // ✅ Debug log

      if (response.ok) {
        dispatch(setOrders([...existingOrders, data])); // ✅ Append order instead of replacing
        console.log("Updated Redux Orders:", [...existingOrders, data]); // ✅ Debug log
        alert("Order placed successfully!");
      } else {
        console.error("Order placement failed:", data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default OrderPlacement;
