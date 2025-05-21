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

export interface SocialAuthRequest {
  token: string;  // OAuth token from the provider
  provider: 'google' | 'facebook';
}

export interface OAuthRedirectRequest {
  provider: 'google' | 'facebook';
  returnUrl?: string;  // URL to return to after authentication
}

export interface OAuthUrlResponse {
  url: string;  // URL to redirect the user to for OAuth
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
    
    // Social authentication endpoints
    socialAuth: builder.mutation<AuthResponse, SocialAuthRequest>({
      query: (socialData) => ({
        url: `/auth/${socialData.provider}`,
        method: 'POST',
        body: { token: socialData.token },
      }),
      invalidatesTags: ['User'],
    }),
    
    // Get OAuth URL for redirecting to provider's auth page
    getOAuthUrl: builder.mutation<OAuthUrlResponse, OAuthRedirectRequest>({
      query: (params) => ({
        url: `/auth/${params.provider}/url`,
        method: 'POST',
        body: params.returnUrl ? { returnUrl: params.returnUrl } : {},
      }),
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
  useSocialAuthMutation,
  useGetOAuthUrlMutation,
} = authApi;
