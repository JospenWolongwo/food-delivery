import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useGetFeaturedMealsQuery } from "../../store/api/mealsApi";
import MealCard from "./MealCard";
import gsap from "gsap";

const FeaturedMeals: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    data: meals = [],
    isLoading,
    error,
  } = useGetFeaturedMealsQuery({ limit: 6 });

  // Animation on component mount
  useEffect(() => {
    if (containerRef.current && !isLoading && meals.length > 0) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".meal-card"),
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
        }
      );
    }
  }, [isLoading, meals]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Featured Meals
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our most popular and delicious dishes, prepared with love
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="animate-pulse bg-gray-200 h-48 w-full"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-red-600 mb-3">Oops!</h2>
            <p className="text-red-500 mb-4">Failed to load featured meals.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (meals.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              No Featured Meals
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any featured meals at the moment. Please check
              back later!
            </p>
            <Link
              to="/meals"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse All Meals
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 bg-gradient-to-b from-gray-50 to-white"
      ref={containerRef}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1 rounded-full mb-3">
            Special Selection
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Featured Meals
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our most popular and delicious dishes, prepared with love
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {meals.map((meal) => (
            <div key={meal.id} className="meal-card">
              <MealCard
                meal={meal}
                className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/meals"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            View All Meals
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMeals;
