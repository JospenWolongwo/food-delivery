import React, { useState, useEffect } from 'react';
import { useGetMealsQuery } from '../../store/api/mealsApi';
import MealCard from './MealCard';
import gsap from 'gsap';

interface MealListProps {
  vendorId?: number;
  category?: string;
  searchTerm?: string;
  featured?: boolean;
  limit?: number;
}

const MealList: React.FC<MealListProps> = ({
  vendorId,
  category,
  searchTerm = '',
  featured = false,
  limit,
}) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    isAvailable?: boolean;
  }>({});

  // Prepare query parameters
  const queryParams = {
    page,
    limit: limit || 12,
    search: searchTerm,
    category,
    vendorId,
    ...filters,
  };

  // Fetch meals using RTK Query
  const { data, isLoading, error, refetch } = useGetMealsQuery(queryParams);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  // Animation for filter changes
  useEffect(() => {
    if (data && !isLoading) {
      gsap.fromTo(
        '.meal-grid > div',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [data, isLoading]);

  // Handle price filter changes
  const handlePriceFilterChange = (
    type: 'minPrice' | 'maxPrice',
    value: string
  ) => {
    const numValue = value === '' ? undefined : Number(value);
    setFilters({ ...filters, [type]: numValue });
    setPage(1); // Reset to first page when filters change
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, sort: e.target.value });
    setPage(1);
  };

  // Handle availability filter
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      isAvailable: e.target.checked ? true : undefined,
    });
    setPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    // Scroll to top of meal list
    window.scrollTo({
      top: document.querySelector('.meal-list-container')?.getBoundingClientRect().top || 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
        <p>Error loading meals. Please try again later.</p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center my-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No meals found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or check back later for new offerings.
        </p>
      </div>
    );
  }

  return (
    <div className="meal-list-container">
      {/* Filters section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceFilterChange('minPrice', e.target.value)}
                min="0"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceFilterChange('maxPrice', e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={filters.sort || ''}
              onChange={handleSortChange}
            >
              <option value="">Default</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="name:asc">Name: A-Z</option>
              <option value="name:desc">Name: Z-A</option>
              <option value="rating:desc">Highest Rated</option>
            </select>
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={filters.isAvailable === true}
                onChange={handleAvailabilityChange}
              />
              <span className="ml-2 text-sm text-gray-700">Available Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Meals grid */}
      <div className="meal-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.items.map((meal) => (
          <MealCard key={meal.id} meal={meal} featured={featured && meal.id === data.items[0].id} />
        ))}
      </div>

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
              let pageNumber: number;
              const middlePage = Math.min(Math.max(page, 3), data.meta.totalPages - 2);
              
              if (data.meta.totalPages <= 5) {
                pageNumber = i + 1;
              } else if (i === 0) {
                pageNumber = 1;
              } else if (i === 4) {
                pageNumber = data.meta.totalPages;
              } else {
                pageNumber = middlePage + i - 2;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${page === pageNumber ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.meta.totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === data.meta.totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MealList;
