import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/* BACKEND URL */
const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000' 
    : 'https://your-backend-render-url.onrender.com'; 


/* ASYNC THUNKS */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];

      const res = await axios.get(`${API_BASE}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCartBackend = createAsyncThunk(
  'cart/updateCartBackend',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const token = localStorage.getItem('token');
      if (!token) return cart.products;

      const res = await axios.put(
        `${API_BASE}/api/cart`,
        { products: cart.products },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* HELPERS */
const calcSelectedItems = (products) =>
  products.reduce((total, p) => total + p.quantity, 0);

const calcTotalPrice = (products) =>
  products.reduce((total, p) => total + p.quantity * p.price, 0);

/* INITIAL STATE */
const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  grandTotal: 0,
  taxRate: 0.05,
  loading: false,
};

/* SLICE */

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
    },

    addToCart: (state, action) => {
      const exists = state.products.find((p) => p._id === action.payload._id);
      if (exists) {
        exists.quantity += 1;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
      state.selectedItems = calcSelectedItems(state.products);
      state.totalPrice = calcTotalPrice(state.products);
      state.tax = state.totalPrice * state.taxRate;
      state.grandTotal = state.totalPrice + state.tax;
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload._id);
      state.selectedItems = calcSelectedItems(state.products);
      state.totalPrice = calcTotalPrice(state.products);
      state.tax = state.totalPrice * state.taxRate;
      state.grandTotal = state.totalPrice + state.tax;
    },

    updateQuantity: (state, action) => {
      state.products = state.products.map((p) => {
        if (p._id === action.payload._id) {
          if (action.payload.type === 'increment') return { ...p, quantity: p.quantity + 1 };
          if (action.payload.type === 'decrement' && p.quantity > 1) return { ...p, quantity: p.quantity - 1 };
        }
        return p;
      });
      state.selectedItems = calcSelectedItems(state.products);
      state.totalPrice = calcTotalPrice(state.products);
      state.tax = state.totalPrice * state.taxRate;
      state.grandTotal = state.totalPrice + state.tax;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.selectedItems = calcSelectedItems(state.products);
        state.totalPrice = calcTotalPrice(state.products);
        state.tax = state.totalPrice * state.taxRate;
        state.grandTotal = state.totalPrice + state.tax;
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })

      .addCase(updateCartBackend.fulfilled, (state, action) => {
        state.products = action.payload || [];
        state.selectedItems = calcSelectedItems(state.products);
        state.totalPrice = calcTotalPrice(state.products);
        state.tax = state.totalPrice * state.taxRate;
        state.grandTotal = state.totalPrice + state.tax;
      });
  },
});

export const { clearCart, addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;