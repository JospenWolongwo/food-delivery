import { api } from './index';

// Define types for meal requests and responses
export interface Meal {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isAvailable: boolean;
  vendorId: number;
  vendor?: {
    id: number;
    name: string;
    logoUrl?: string;
  };
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MealFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: number;
  isAvailable?: boolean;
  sort?: string; // e.g. 'price:asc', 'name:desc'
}

export interface PaginatedMealsResponse {
  items: Meal[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Extend the base API with meal-specific endpoints
export const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMeals: builder.query<PaginatedMealsResponse, MealFilterParams | void>({
      query: (params = {}) => ({
        url: '/meals',
        method: 'GET',
        params,
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.items.map(({ id }) => ({ type: 'Meal' as const, id })),
              { type: 'Meal' as const, id: 'LIST' },
            ]
          : [{ type: 'Meal' as const, id: 'LIST' }],
    }),
    
    getMealById: builder.query<Meal, number>({
      query: (id) => `/meals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Meal' as const, id }],
    }),
    
    // For customers to get meals from specific vendors
    getVendorMeals: builder.query<PaginatedMealsResponse, { vendorId: number; params?: MealFilterParams }>({
      query: ({ vendorId, params = {} }) => ({
        url: `/vendors/${vendorId}/meals`,
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Meal' as const, id })),
              { type: 'Meal' as const, id: 'VENDOR-LIST' },
            ]
          : [{ type: 'Meal' as const, id: 'VENDOR-LIST' }],
    }),
    
    // The following endpoints would typically be used by vendors or admins
    createMeal: builder.mutation<Meal, Partial<Meal>>({
      query: (meal) => ({
        url: '/meals',
        method: 'POST',
        body: meal,
      }),
      invalidatesTags: [{ type: 'Meal', id: 'LIST' }],
    }),
    
    updateMeal: builder.mutation<Meal, { id: number; updates: Partial<Meal> }>({
      query: ({ id, updates }) => ({
        url: `/meals/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Meal', id },
        { type: 'Meal', id: 'LIST' },
      ],
    }),
    
    deleteMeal: builder.mutation<void, number>({
      query: (id) => ({
        url: `/meals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Meal', id },
        { type: 'Meal', id: 'LIST' },
      ],
    }),
  }),
  
  overrideExisting: false,
});

// Export auto-generated hooks for the endpoints
export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useGetVendorMealsQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} = mealsApi;
