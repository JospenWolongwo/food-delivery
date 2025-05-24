import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import { api } from './api';

// Import all API endpoints directly from their modules to avoid circular dependencies
import { authApi } from './api/authApi';
import { mealsApi } from './api/mealsApi';
import { orderApi } from './api/orderApi';
import { vendorsApi } from './api/vendorsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    // Include a single API reducer for all endpoints
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Prevent serialization checks for RTK Query cache values
      serializableCheck: false,
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export all APIs for use in components
export {
  api,
  authApi,
  mealsApi,
  orderApi,
  vendorsApi,
};
