import { api } from './index';

// Define types for meal requests and responses
export interface Meal {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  vendor: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetMealsParams {
  category?: string;
  vendorId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MealsResponse {
  items: Meal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Extend the base API with meal-specific endpoints
export const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMeals: builder.query<MealsResponse, GetMealsParams | void>({
      query: (params = {}) => ({
        url: '/meals',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Meals' as const, id })),
              { type: 'Meals' as const, id: 'LIST' },
            ]
          : [{ type: 'Meals' as const, id: 'LIST' }],
    }),
    
    getMealById: builder.query<Meal, number>({
      query: (id) => `/meals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Meals' as const, id }],
    }),
    
    getFeaturedMeals: builder.query<Meal[], void>({
      query: () => '/meals/featured',
      providesTags: [{ type: 'Meals' as const, id: 'FEATURED' }],
    }),
    
    getMealsByCategory: builder.query<Meal[], string>({
      query: (category) => `/meals/category/${category}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Meals' as const, id })),
              { type: 'Meals' as const, id: 'CATEGORY' },
            ]
          : [{ type: 'Meals' as const, id: 'CATEGORY' }],
    }),
    
    getRelatedMeals: builder.query<Meal[], number>({
      query: (mealId) => `/meals/${mealId}/related`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Meals' as const, id })),
              { type: 'Meals' as const, id: 'RELATED' },
            ]
          : [{ type: 'Meals' as const, id: 'RELATED' }],
    }),
  }),
  
  // This ensures that these endpoints won't be overridden by future calls to injectEndpoints
  overrideExisting: false,
});

// Export auto-generated hooks for the endpoints
export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useGetFeaturedMealsQuery,
  useGetMealsByCategoryQuery,
  useGetRelatedMealsQuery,
} = mealsApi;
