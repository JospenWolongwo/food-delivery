import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a base API service
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    // Configure the API base URL - adjust this for your environment
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as any).auth.token;
      
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

// DO NOT re-export all API services to avoid circular dependencies
// These should be imported directly from their respective files
