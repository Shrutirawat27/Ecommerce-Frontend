import { createSlice } from "@reduxjs/toolkit";

const loadUserFromLocalStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    return {
      user: user || null,
      token: token || null,
    };
  } catch {
    return { user: null, token: null };
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
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
        if (state.user._id) localStorage.setItem("userId", state.user._id);
      }
    },
    setUserFromStorage: (state) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      state.user = user || null;
      state.token = token || null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setUser, logout, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;