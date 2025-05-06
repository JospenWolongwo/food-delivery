import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGetMealsQuery } from '../../store/api/mealsApi';
import MealCard from './MealCard';
import gsap from 'gsap';

const FeaturedMeals: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Get top 5 meals, sorted by rating
  const { data, isLoading, error } = useGetMealsQuery({
    limit: 5,
    sort: 'rating:desc',
    isAvailable: true,
  });
  
  // Animation on component mount
  useEffect(() => {
    if (sectionRef.current && !isLoading && data) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [isLoading, data]);
  
  if (isLoading) {
    return (
      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Meals</h2>
            <p className="mt-4 text-xl text-gray-500">Loading our top-rated meals...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Meals</h2>
            <p className="mt-4 text-xl text-gray-500">We're having trouble loading our featured meals right now.</p>
          </div>
          <div className="text-center">
            <Link to="/meals" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Browse All Meals
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!data || data.items.length === 0) {
    return (
      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Meals</h2>
            <p className="mt-4 text-xl text-gray-500">No meals available at the moment. Check back soon!</p>
          </div>
          <div className="text-center">
            <Link to="/meals" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              Browse All Meals
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={sectionRef} className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Meals</h2>
          <p className="mt-4 text-xl text-gray-500">Discover our highest-rated and most popular meals</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main featured meal - larger display */}
          <div className="lg:col-span-2">
            {data.items[0] && (
              <MealCard meal={data.items[0]} featured={true} />
            )}
          </div>
          
          {/* Secondary featured meals */}
          <div className="space-y-8">
            {data.items.slice(1, 3).map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
        
        {/* Additional featured meals */}
        {data.items.length > 3 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.slice(3).map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            to="/meals" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            View All Meals
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMeals;
