import { createSlice, configureStore } from "@reduxjs/toolkit";
import { deleteCookie, setCookie } from "cookies-next/client";

const userSlice = createSlice({
    name:"auth",
    initialState: {
        user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
        isLogin: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false
    },
    reducers: {
        login(state, action) {
         
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLogin = true;
            localStorage.setItem("token", action.payload.token);
            setCookie("token", action.payload.token);
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.isLogin = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
            deleteCookie("token");
        }
    }
});

export const { login, logout } = userSlice.actions

export const userStore = configureStore({
    reducer: userSlice.reducer
})
