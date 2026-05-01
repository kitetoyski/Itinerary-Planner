// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducer/reducer'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
