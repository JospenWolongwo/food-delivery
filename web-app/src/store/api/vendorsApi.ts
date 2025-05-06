import { api } from './index';

// Define types for vendor requests and responses
export interface Vendor {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
  bannerImageUrl?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  categories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VendorFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sort?: string;
}

export interface PaginatedVendorsResponse {
  items: Vendor[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Extend the base API with vendor-specific endpoints
export const vendorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all vendors (paginated)
    getVendors: builder.query<PaginatedVendorsResponse, VendorFilterParams | void>({
      query: (params = {}) => ({
        url: '/vendors',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Vendor' as const, id })),
              { type: 'Vendor' as const, id: 'LIST' },
            ]
          : [{ type: 'Vendor' as const, id: 'LIST' }],
    }),
    
    // Get a specific vendor by ID
    getVendorById: builder.query<Vendor, number>({
      query: (id) => `/vendors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vendor' as const, id }],
    }),
    
    // Admin-only operations
    createVendor: builder.mutation<Vendor, Partial<Vendor>>({
      query: (vendorData) => ({
        url: '/vendors',
        method: 'POST',
        body: vendorData,
      }),
      invalidatesTags: [{ type: 'Vendor', id: 'LIST' }],
    }),
    
    updateVendor: builder.mutation<Vendor, { id: number; updates: Partial<Vendor> }>({
      query: ({ id, updates }) => ({
        url: `/vendors/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vendor', id },
        { type: 'Vendor', id: 'LIST' },
      ],
    }),
    
    setVendorActivation: builder.mutation<Vendor, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/vendors/${id}/activation`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vendor', id },
        { type: 'Vendor', id: 'LIST' },
      ],
    }),
    
    deleteVendor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Vendor', id },
        { type: 'Vendor', id: 'LIST' },
      ],
    }),
    
    // Get vendors by category
    getVendorsByCategory: builder.query<PaginatedVendorsResponse, { category: string; params?: VendorFilterParams }>({
      query: ({ category, params = {} }) => ({
        url: '/vendors',
        method: 'GET',
        params: {
          ...params,
          category,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Vendor' as const, id })),
              { type: 'Vendor' as const, id: 'CATEGORY_LIST' },
            ]
          : [{ type: 'Vendor' as const, id: 'CATEGORY_LIST' }],
    }),
    
    // Get top-rated vendors
    getTopVendors: builder.query<Vendor[], number>({
      query: (limit = 5) => ({
        url: '/vendors',
        method: 'GET',
        params: {
          sort: 'rating:desc',
          limit,
        },
      }),
      providesTags: [{ type: 'Vendor', id: 'TOP_LIST' }],
    }),
  }),
  
  overrideExisting: false,
});

// Export auto-generated hooks for the endpoints
export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useSetVendorActivationMutation,
  useDeleteVendorMutation,
  useGetVendorsByCategoryQuery,
  useGetTopVendorsQuery,
} = vendorsApi;
