import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { updateCartBackend } from './features/cart/cartSlice';
import authApi from './features/auth/authApi';
import authReducer from './features/auth/authSlice';
import productsApi from './features/products/productsApi';
import productsReducer from './features/products/productsSlice';
import reviewApi from './features/reviews/reviewsApi';
import navigationReducer from './features/navigation/navigationSlice';

// Middleware to auto-sync cart to backend on add/remove/update
const autoSyncCartMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const cartActions = ['cart/addToCart', 'cart/removeFromCart', 'cart/updateQuantity'];
  if (cartActions.includes(action.type)) {
    const state = store.getState();
    if (state.auth.user) {
      store.dispatch(updateCartBackend());
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    navigation: navigationReducer,
    products: productsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      reviewApi.middleware,
      autoSyncCartMiddleware // Add cart auto-sync middleware
    ),
});
