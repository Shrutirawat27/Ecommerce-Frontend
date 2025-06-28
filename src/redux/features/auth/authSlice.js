import { createSlice } from "@reduxjs/toolkit";

const loadUserFromLocalStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? { user } : { user: null };
  } catch {
    return { user: null };
  }
};

const initialState = loadUserFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload?.user) {
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(state.user));

        if (state.user._id) {
          localStorage.setItem("userId", state.user._id);
        }
      }
    },
    setUserFromStorage: (state) => {
      const user = JSON.parse(localStorage.getItem("user"));
      state.user = user || null;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setUser, logout, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;