import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  path: '/',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigateTo: (state, action) => {
      state.path = action.payload;
    },
  },
});

// Export the action
export const { navigateTo } = navigationSlice.actions;

// Export the reducer
export default navigationSlice.reducer;
