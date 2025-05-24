import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGetFeaturedMealsQuery } from '../../store/api/mealsApi';
import MealCard from './MealCard';
import gsap from 'gsap';

const FeaturedMeals: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: meals = [], isLoading, error } = useGetFeaturedMealsQuery({ limit: 5 });

  // Animation on component mount
  useEffect(() => {
    if (containerRef.current && !isLoading && meals.length > 0) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.meal-card'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, [isLoading, meals]);

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Meals</h2>
            <p className="text-gray-600">Discover our most popular dishes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-lg bg-gray-200 h-80 w-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Meals</h2>
          <p className="text-red-500">Failed to load featured meals. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (meals.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Meals</h2>
          <p className="text-gray-600">No featured meals available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50" ref={containerRef}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Meals</h2>
            <p className="text-gray-600">Discover our most popular dishes</p>
          </div>
          <Link
            to="/meals"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all meals →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {meals.map((meal) => (
            <div key={meal.id} className="meal-card">
              <MealCard meal={meal} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMeals;
