import { api } from './index';

// Define types for auth requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string; // Optional, defaults to 'customer' on the backend
}

export interface AuthResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

// Extend the base API with auth-specific endpoints
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Invalidate the User tag to trigger refetches
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      // Invalidate the User tag to trigger refetches
      invalidatesTags: ['User'],
    }),
    
    getProfile: builder.query<AuthResponse['user'], void>({
      query: () => '/users/profile',
      // This will only be cached with the 'User' tag
      providesTags: ['User'],
    }),
  }),
  
  // This ensures that these endpoints won't be overridden by future calls to injectEndpoints
  overrideExisting: false,
});

// Export auto-generated hooks for the endpoints
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} = authApi;
