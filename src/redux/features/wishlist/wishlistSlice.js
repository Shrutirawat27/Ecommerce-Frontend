import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';

import axios from 'axios';

import { getBaseUrl }
from '../../../utils/baseURL';

const API_BASE = getBaseUrl();

export const fetchWishlist =
  createAsyncThunk(
    'wishlist/fetchWishlist',

    async (_, { rejectWithValue }) => {

      try {

        const res = await axios.get(
          `${API_BASE}/api/wishlist`,
          {
            withCredentials: true
          }
        );

        return res.data.products;

      } catch (err) {

        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const toggleWishlistAsync =
  createAsyncThunk(
    'wishlist/toggleWishlist',

    async (product, { rejectWithValue }) => {

      try {

        const res = await axios.post(
          `${API_BASE}/api/wishlist/toggle`,
          {
            productId: product._id
          },
          {
            withCredentials: true
          }
        );

        return res.data.products;

      } catch (err) {

        console.log(
  "WISHLIST ERROR:",
  err.response?.data || err.message
);

return rejectWithValue(
  err.response?.data || err.message
);
      }
    }
  );

const wishlistSlice = createSlice({

  name: 'wishlist',

  initialState: {
    products: [],
    loading: false
  },

  reducers: {

    clearWishlist: (state) => {

      state.products = [];
    }
  },

  extraReducers: (builder) => {

    builder

      .addCase(fetchWishlist.pending,
        (state) => {

          state.loading = true;
        })

      .addCase(fetchWishlist.fulfilled,
        (state, action) => {

          state.loading = false;

          state.products =
            action.payload || [];
        })

      .addCase(fetchWishlist.rejected,
        (state) => {

          state.loading = false;
        })

      .addCase(toggleWishlistAsync.fulfilled,
  (state, action) => {

    console.log(
      "WISHLIST PAYLOAD:",
      action.payload
    );

    state.products =
      action.payload || [];
});
  }
});

export const {
  clearWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;