import { createSlice } from "@reduxjs/toolkit";

const loadUserFromLocalStorage = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? { user } : { user: null };
    } catch (error) {
        return { user: null };
    }
};

const initialState = loadUserFromLocalStorage();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            localStorage.setItem("user", JSON.stringify(state.user));
            
            // Also store userId separately for easier access
            if (action.payload.user && action.payload.user._id) {
                localStorage.setItem("userId", action.payload.user._id);
                console.log("Stored userId in localStorage:", action.payload.user._id);
            }
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
        }
    }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
