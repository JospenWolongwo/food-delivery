import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGetMealsQuery } from "../../store/api/mealsApi";
import { Meal } from "../../store/api/types";
import MealCard from "./MealCard";
import gsap from "gsap";

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  isAvailable?: boolean;
}

interface MealListProps {
  vendorId?: number;
  category?: string;
  searchTerm?: string;
  featured?: boolean;
  limit?: number;
  filters?: Record<string, string | number | undefined>;
}

const ITEMS_PER_PAGE = 12;

const MealList: React.FC<MealListProps> = ({
  vendorId,
  category,
  searchTerm = "",
  featured = false,
  limit,
  filters,
}) => {
  const [page, setPage] = useState(1);
  const [localFilters, setLocalFilters] = useState<FilterState>({});

  // Prepare query parameters (without pagination and sorting)
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      search: searchTerm,
      category,
      vendorId,
    };

    // Only include filters that are not undefined and not related to sorting
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        // Explicitly exclude sort-related parameters from the API call
        if (value !== undefined && key !== "sortBy" && key !== "sortOrder") {
          params[key] = value;
        }
      });
    }

    return params;
  }, [searchTerm, category, vendorId, filters]);

  // Destructure local filters (used for client-side filtering/sorting)
  const { sortBy, sortOrder, isAvailable, minPrice, maxPrice } = localFilters;

  // Fetch all meals using RTK Query
  const {
    data: allMeals = [],
    isLoading,
    error,
    refetch,
  } = useGetMealsQuery(queryParams);

  // Apply filtering based on local filters
  const filteredMeals = useMemo(() => {
    let result = [...allMeals];

    // Apply availability filter
    if (isAvailable) {
      result = result.filter((meal) => meal.isAvailable);
    }

    // Apply price range filter
    if (minPrice !== undefined) {
      result = result.filter((meal) => parseFloat(meal.price) >= minPrice);
    }

    if (maxPrice !== undefined) {
      result = result.filter((meal) => parseFloat(meal.price) <= maxPrice);
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === "price") {
          return sortOrder === "asc"
            ? parseFloat(a.price) - parseFloat(b.price)
            : parseFloat(b.price) - parseFloat(a.price);
        }
        return 0;
      });
    }

    return result;
  }, [allMeals, sortBy, sortOrder, isAvailable, minPrice, maxPrice]);

  // Log the filtered meals for debugging
  useEffect(() => {
    if (allMeals.length > 0) {
      console.log("Meals loaded:", allMeals.length, "items");
      console.log("Filtered Meals:", filteredMeals.length, "items");
    }
  }, [allMeals, filteredMeals]);

  // Calculate pagination
  const { meals, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedMeals = filteredMeals.slice(startIndex, endIndex);

    console.log("Paginated Meals:", paginatedMeals);

    return {
      meals: limit ? paginatedMeals.slice(0, limit) : paginatedMeals,
      totalPages: Math.ceil(filteredMeals.length / ITEMS_PER_PAGE),
    };
  }, [filteredMeals, page, limit]);

  // Handle filter changes
  const handlePriceFilterChange = useCallback(
    (type: "minPrice" | "maxPrice", value: string) => {
      setLocalFilters((prev) => ({
        ...prev,
        [type]: value ? Number(value) : undefined,
      }));
      setPage(1); // Reset to first page when filters change
    },
    []
  );

  const handleAvailabilityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalFilters((prev) => ({
        ...prev,
        isAvailable: e.target.checked,
      }));
      setPage(1);
    },
    []
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [sortBy, sortOrder = "asc"] = e.target.value.split(":");
      setLocalFilters((prev) => ({
        ...prev,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || "asc",
      }));
    },
    []
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getCurrentSortValue = useCallback(() => {
    const { sortBy, sortOrder } = localFilters;
    return sortBy ? `${sortBy}:${sortOrder || "asc"}` : "";
  }, [localFilters]);

  // Animation for meal grid and debug logs
  useEffect(() => {
    // Debug logs
    console.log("All Meals:", allMeals);
    console.log("Filtered Meals:", filteredMeals);
    console.log("Current Page Meals:", meals);

    // Only run animation if we have meals and loading is complete
    if (meals.length > 0 && !isLoading) {
      gsap.fromTo(
        ".meal-grid-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: "power2.out",
        }
      );
    }
  }, [meals, isLoading, allMeals, filteredMeals]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse bg-gray-200 h-12 w-64 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg bg-gray-200 h-80 w-full"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error("Error loading meals:", error);
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium mb-2">
          Error loading meals
        </div>
        <p className="text-gray-600 mb-4">Please try again later</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle no results
  if (meals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No meals found</div>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-4">
          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="priceRange"
                className="block text-sm font-medium text-gray-700"
              >
                Price Range
              </label>
              <span className="text-xs text-gray-500">
                {localFilters.minPrice !== undefined ||
                localFilters.maxPrice !== undefined
                  ? `${localFilters.minPrice ?? "0"} - ${
                      localFilters.maxPrice ?? "∞"
                    }`
                  : "Any"}
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="minPrice"
                    min="0"
                    step="0.01"
                    placeholder="Min"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={localFilters.minPrice ?? ""}
                    onChange={(e) =>
                      handlePriceFilterChange("minPrice", e.target.value)
                    }
                    aria-label="Minimum price"
                  />
                </div>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="text-sm">to</span>
              </div>
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="maxPrice"
                    min="0"
                    step="0.01"
                    placeholder="Max"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={localFilters.maxPrice ?? ""}
                    onChange={(e) =>
                      handlePriceFilterChange("maxPrice", e.target.value)
                    }
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              className="px-2 py-1 border rounded"
              value={getCurrentSortValue()}
              onChange={handleSortChange}
            >
              <option value="">Default</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="name:asc">Name: A to Z</option>
              <option value="name:desc">Name: Z to A</option>
              <option value="createdAt:desc">Newest First</option>
            </select>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="available"
              className="rounded text-primary-600 focus:ring-primary-500"
              checked={!!localFilters.isAvailable}
              onChange={handleAvailabilityChange}
            />
            <label htmlFor="available" className="text-sm text-gray-700">
              Available only
            </label>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meals.map((meal: Meal) => (
          <div key={meal.id} className="meal-grid-item">
            <MealCard meal={meal} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    page === pageNum
                      ? "bg-primary-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealList;
