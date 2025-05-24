import { api } from "./index";

// Define types for auth requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string; // Optional phone number
}

export interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface SocialAuthRequest {
  token: string; // OAuth token from the provider
  provider: "google" | "facebook";
}

export interface OAuthRedirectRequest {
  provider: "google" | "facebook";
  returnUrl?: string; // URL to return to after authentication
}

export interface OAuthUrlResponse {
  url: string; // URL to redirect the user to for OAuth
}

// Extend the base API with auth-specific endpoints
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "api/auth/login",
        method: "POST",
        body: credentials,
      }),
      // Invalidate the User tag to trigger refetches
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "api/auth/register",
        method: "POST",
        body: userData,
      }),
      // Invalidate the User tag to trigger refetches
      invalidatesTags: ["User"],
    }),

    // Social authentication endpoints
    socialAuth: builder.mutation<AuthResponse, SocialAuthRequest>({
      query: (socialData) => ({
        url: `api/auth/${socialData.provider}`,
        method: "POST",
        body: { token: socialData.token },
      }),
      invalidatesTags: ["User"],
    }),

    // Get OAuth URL for redirecting to provider's auth page
    getOAuthUrl: builder.mutation<OAuthUrlResponse, OAuthRedirectRequest>({
      query: (params) => ({
        url: `api/auth/${params.provider}/url`,
        method: "POST",
        body: params.returnUrl ? { returnUrl: params.returnUrl } : {},
      }),
    }),

    getProfile: builder.query<AuthResponse["user"], void>({
      query: () => "api/users/profile",
      // This will only be cached with the 'User' tag
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (profileData) => ({
        url: "api/users/profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["User"],
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
  useUpdateProfileMutation,
  useSocialAuthMutation,
  useGetOAuthUrlMutation,
} = authApi;
