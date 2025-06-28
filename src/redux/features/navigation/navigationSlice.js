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

export const { navigateTo } = navigationSlice.actions;
export default navigationSlice.reducer;