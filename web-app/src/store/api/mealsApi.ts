import { api } from "./index";

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
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetMealsParams {
  category?: string;
  vendorId?: number;
  search?: string;
  // Removed page and limit as they'll be handled on the frontend
}

export interface MealsResponse {
  data: {
    items: Meal[];
    total: number;
    totalPages: number;
  };
}

// Extend the base API with meal-specific endpoints
export const mealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMeals: builder.query<Meal[], GetMealsParams | void>({
      query: (params = {}) => ({
        url: "api/meals",
        method: "GET",
        params: {
          ...params,
        },
      }),
      transformResponse: (response: Meal[] | { data: Meal[] }) => {
        // The API returns either an array of meals or an object with a data property containing the array
        return Array.isArray(response) ? response : response.data || [];
      },
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: "Meals" as const, id })),
        { type: "Meals" as const, id: "LIST" },
      ],
    }),

    getMealById: builder.query<Meal, number>({
      query: (id) => `api/meals/${id}`,
      providesTags: (result, error, id) => [{ type: "Meals" as const, id }],
    }),

    deleteMeal: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `api/meals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Meal", id },
        { type: "Meal", id: "LIST" },
      ],
    }),

    getMealsByCategory: builder.query<Meal[], string>({
      query: (category) => `/meals/category/${category}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Meals" as const, id })),
              { type: "Meals" as const, id: "CATEGORY" },
            ]
          : [{ type: "Meals" as const, id: "CATEGORY" }],
    }),

    getRelatedMeals: builder.query<Meal[], { mealId: number; limit?: number }>({
      query: ({ mealId, limit = 4 }) => ({
        url: `api/meals/${mealId}/related`,
        params: { limit },
      }),
      providesTags: (result, error, { mealId }) => [
        { type: "Meals" as const, id: `RELATED_${mealId}` },
      ],
    }),

    getFeaturedMeals: builder.query<Meal[], { limit?: number }>({
      query: ({ limit = 5 } = {}) => ({
        url: "api/meals",
        params: {
          isFeatured: true,
        },
      }),
      providesTags: [{ type: "Meals" as const, id: "FEATURED" }],
      transformResponse: (response: any) => {
        // Handle both response formats
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),
  }),

  // This ensures that these endpoints won't be overridden by future calls to injectEndpoints
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useGetFeaturedMealsQuery,
  useGetMealsByCategoryQuery,
  useGetRelatedMealsQuery,
  useDeleteMealMutation,
} = mealsApi;
