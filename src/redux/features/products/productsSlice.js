// src/features/products/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allProducts: [], // 🔹 Store all available products
  orders: [],  // 🔹 Store the list of ordered products for the buyer
  currency: '$',  // 🔹 Currency (this can be dynamic or static)
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;  // 🔹 Store all fetched products
    },
    setOrders: (state, action) => {
      console.log("Updated Orders:", action.payload);
      state.orders = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;  // 🔹 Update the currency
    },
  },
});

export const { setAllProducts, setOrders, setCurrency } = productsSlice.actions;
export default productsSlice.reducer;
