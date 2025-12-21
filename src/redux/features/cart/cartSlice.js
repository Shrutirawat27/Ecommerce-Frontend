import { createSlice } from '@reduxjs/toolkit';

// 🔹 helpers to get user-based key
const getUserId = () => localStorage.getItem('userId');
const getCartKey = () => {
  const userId = getUserId();
  return userId ? `cart_${userId}` : null;
};

// 🔹 load cart for logged-in user
const loadCart = () => {
  const key = getCartKey();
  if (!key) return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 🔹 utilities (UNCHANGED)
export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

export const setTotalPrice = (state) =>
  state.products.reduce(
    (total, product) => total + product.quantity * product.price,
    0
  );

export const setTax = (state) => setTotalPrice(state) * state.taxRate;

export const setGrandTotal = (state) =>
  setTotalPrice(state) + setTax(state);

// 🔹 initial cart per user
const products = loadCart();

const initialState = {
  products,
  selectedItems: products.reduce((t, p) => t + p.quantity, 0),
  totalPrice: products.reduce((t, p) => t + p.quantity * p.price, 0),
  taxRate: 0.05,
  tax: products.reduce((t, p) => t + p.quantity * p.price, 0) * 0.05,
  grandTotal:
    products.reduce((t, p) => t + p.quantity * p.price, 0) +
    products.reduce((t, p) => t + p.quantity * p.price, 0) * 0.05,
};

// 🔹 save cart per user
const saveCart = (products) => {
  const key = getCartKey();
  if (key) {
    localStorage.setItem(key, JSON.stringify(products));
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const exists = state.products.find(
        (p) => p._id === action.payload._id
      );

      if (!exists) {
        state.products.push({ ...action.payload, quantity: 1 });
      }

      saveCart(state.products);
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
    },

    updateQuantity: (state, action) => {
      state.products = state.products.map((product) => {
        if (product._id === action.payload._id) {
          if (action.payload.type === 'increment') {
            return { ...product, quantity: product.quantity + 1 };
          }
          if (action.payload.type === 'decrement' && product.quantity > 1) {
            return { ...product, quantity: product.quantity - 1 };
          }
        }
        return product;
      });

      saveCart(state.products);
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload._id
      );

      saveCart(state.products);
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
    },

    clearCart: (state) => {
      const key = getCartKey();
      if (key) localStorage.removeItem(key);

      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
