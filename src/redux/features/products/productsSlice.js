import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allProducts: [],
  orders: [],
  currency: '$',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    setOrders: (state, action) => {
      console.log("Updated Orders:", action.payload);
      state.orders = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setAllProducts, setOrders, setCurrency } = productsSlice.actions;
export default productsSlice.reducer;