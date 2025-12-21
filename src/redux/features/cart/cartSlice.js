import { createSlice } from '@reduxjs/toolkit'

// 🔹 load cart from localStorage
const storedProducts = localStorage.getItem('cartProducts');
const parsedProducts = storedProducts ? JSON.parse(storedProducts) : [];

// 🔹 utilities functions (UNCHANGED)
export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

export const setTotalPrice = (state) =>
  state.products.reduce((total, product) => total + product.quantity * product.price, 0);

export const setTax = (state) => setTotalPrice(state) * state.taxRate;

export const setGrandTotal = (state) =>
  setTotalPrice(state) + setTax(state);

// 🔹 INITIAL STATE WITH PRE-CALCULATION
const initialState = {
  products: parsedProducts,
  selectedItems: parsedProducts.reduce((t, p) => t + p.quantity, 0),
  totalPrice: parsedProducts.reduce((t, p) => t + p.quantity * p.price, 0),
  tax: parsedProducts.reduce((t, p) => t + p.quantity * p.price, 0) * 0.05,
  taxRate: 0.05,
  grandTotal:
    parsedProducts.reduce((t, p) => t + p.quantity * p.price, 0) +
    parsedProducts.reduce((t, p) => t + p.quantity * p.price, 0) * 0.05,
};

// 🔹 save helper
const saveCart = (products) => {
  localStorage.setItem('cartProducts', JSON.stringify(products));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product) => product._id === action.payload._id
      );

      if (!isExist) {
        state.products.push({ ...action.payload, quantity: 1 });
        saveCart(state.products);
      }

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
          } else if (
            action.payload.type === 'decrement' &&
            product.quantity > 1
          ) {
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
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;

      localStorage.removeItem('cartProducts');
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
