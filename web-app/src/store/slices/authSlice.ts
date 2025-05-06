import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, AuthResponse } from '../api/authApi';

// Use the User type from the AuthResponse
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CUSTOMER' | 'DELIVERY_AGENT' | 'VENDOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Try to load user and token from localStorage for persistent sessions
const loadTokenFromStorage = () => localStorage.getItem('token');
const loadUserFromStorage = () => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  token: loadTokenFromStorage(),
  isAuthenticated: !!loadTokenFromStorage(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUserProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    // This is for error handling purposes outside of RTK Query
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    // This is to clear any error that might have been set
    clearError: (state) => {
      state.error = null;
    },
  },
  // Use the extraReducers to listen for our API actions
  extraReducers: (builder) => {
    // Login matchers
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    });
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Login failed';
    });

    // Register matchers
    builder.addMatcher(authApi.endpoints.register.matchPending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    });
    builder.addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Registration failed';
    });

    // Get profile matchers
    builder.addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
      state.user = payload;
      localStorage.setItem('user', JSON.stringify(payload));
    });
  },
});

export const {
  logout,
  updateUserProfile,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
