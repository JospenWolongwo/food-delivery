import { api } from './index';

// Define types for meal requests and responses
export interface Meal {
  id: number | string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isAvailable: boolean;
  vendorId?: number;
  vendor?: {
    id?: number;
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
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
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
    
    // Get related meals based on the current meal
    getRelatedMeals: builder.query<Meal[], number>({
      query: (mealId) => `/meals/${mealId}/related`,
      // If the API endpoint doesn't exist yet, use a transformer to mock related data
      transformResponse: (response: Meal[] | undefined, meta, arg) => {
        // If the backend returns related meals, use that data
        if (response && Array.isArray(response)) {
          return response;
        }
        
        // Otherwise, for development, return mock data
        return [
          {
            id: 101,
            name: 'Ndolé with Plantains',
            description: 'Classic Cameroonian dish made with bitter leaves, peanuts, and served with ripe plantains.',
            price: 3500,
            imageUrl: '/meals/ndole.png',
            category: 'Traditional',
            isAvailable: true,
            vendorId: 1,
            vendor: { id: 1, name: 'Mama Africa Kitchen' }
          },
          {
            id: 102,
            name: 'Jollof Rice with Chicken',
            description: 'Spicy rice dish cooked with tomatoes, peppers, and aromatic spices, served with grilled chicken.',
            price: 3000,
            imageUrl: '/meals/jollof-rice.png',
            category: 'West African',
            isAvailable: true,
            vendorId: 1,
            vendor: { id: 1, name: 'Mama Africa Kitchen' }
          },
          {
            id: 103,
            name: 'Koki Beans',
            description: 'Steamed bean cake with palm oil and spices wrapped in banana leaves.',
            price: 2500,
            imageUrl: '/meals/koki-beans.png',
            category: 'Traditional',
            isAvailable: true,
            vendorId: 2,
            vendor: { id: 2, name: 'Campus Delights' }
          }
        ];
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Meal' as const, id }))]
          : [],
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
  useGetRelatedMealsQuery,
} = mealsApi;
