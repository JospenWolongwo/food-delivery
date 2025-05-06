import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '.';

const API_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Development server
  : 'https://api.campusfoods.com/api'; // Production server

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.token;
      
      if (token) {
        // Add authorization header with JWT token
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Meal', 'Order', 'Vendor', 'Subscription'],
  endpoints: () => ({}),
});
