// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');

const initialState = {
  isLoggedIn: !!token,
  user:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      localStorage.setItem('token', action.payload); 
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      state.user = null;

    },
    setUser(state, action) {
        state.user = action.payload; // update user if needed
      },
  },
});

export const { login, logout,setUser} = authSlice.actions;
export default authSlice.reducer;
