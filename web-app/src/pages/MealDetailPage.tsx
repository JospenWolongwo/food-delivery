import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MealDetail from "../components/meals/MealDetail";
import Cart from "../components/cart/Cart";
import {
  useGetMealByIdQuery,
  useGetRelatedMealsQuery,
} from "../store/api/mealsApi";
import gsap from "gsap";
import MealCard from "../components/meals/MealCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import { Meal } from "../types/meal";

// Mock data for development environment
const mockMeal: Meal = {
  id: 1,
  name: "Ndolé with Plantains",
  description:
    "Classic Cameroonian dish made with bitter leaves, peanuts, and served with ripe plantains. This traditional meal is rich in protein and fiber, making it a nutritious choice for any time of day.",
  price: 3500,
  imageUrl: "/meals/ndole.jpg",
  category: "Traditional",
  isAvailable: true,
  preparationTime: 25,
  servingSize: "1 person",
  ingredients: [
    "Bitter leaves",
    "Ground peanuts",
    "Smoked fish",
    "Palm oil",
    "Onions",
    "Garlic",
    "Ripe plantains",
    "Salt and pepper",
  ],
  allergens: ["Peanuts", "Fish"],
  nutritionalInfo: {
    calories: 450,
    protein: 22,
    carbs: 35,
    fats: 28,
    fiber: 8,
    sugar: 12,
    sodium: 380,
  },
  vendorId: 1,
  vendor: {
    id: 1,
    name: "Mama Africa Kitchen",
    description:
      "Authentic African cuisine prepared with love and tradition. Our recipes have been passed down through generations, bringing the true taste of Cameroon to your table.",
    logoUrl: "/images/vendor-placeholder.svg",
    rating: 4.8,
    reviewCount: 124,
    location: "University Campus, Building C",
  },
  rating: 4.7,
  reviewCount: 48,
  tags: ["Spicy", "Traditional", "Protein-rich"],
};

const mockRelatedMeals: Meal[] = [
  {
    id: 101,
    name: "Jollof Rice with Chicken",
    description:
      "Spicy rice dish cooked with tomatoes, peppers, and aromatic spices, served with grilled chicken.",
    price: 3000,
    imageUrl: "/meals/jollof-rice.jpg",
    category: "West African",
    isAvailable: true,
    vendorId: 1,
    vendor: { id: 1, name: "Mama Africa Kitchen" },
    rating: 4.5,
    reviewCount: 37,
  },
  {
    id: 102,
    name: "Koki Beans",
    description:
      "Steamed bean cake with palm oil and spices wrapped in banana leaves.",
    price: 2500,
    imageUrl: "/meals/koki-beans.jpg",
    category: "Traditional",
    isAvailable: true,
    vendorId: 2,
    vendor: { id: 2, name: "Campus Delights" },
    rating: 4.6,
    reviewCount: 29,
  },
  {
    id: 103,
    name: "Okok",
    description:
      "Spicy black stew made with a special blend of spices and served with plantains.",
    price: 4000,
    imageUrl: "/meals/okok.jpg",
    category: "Traditional",
    isAvailable: true,
    vendorId: 1,
    vendor: { id: 1, name: "Mama Africa Kitchen" },
    rating: 4.9,
    reviewCount: 42,
  },
];

const MealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mealId = parseInt(id || "0");
  const navigate = useNavigate();

  // State to track if we should use mock data (for development)
  const [useMockData, setUseMockData] = useState(false);

  // Fetch data from API
  const {
    data: apiMeal,
    isLoading: isApiLoading,
    error: apiError,
  } = useGetMealByIdQuery(mealId);
  const { data: apiRelatedMeals = [], isLoading: isApiLoadingRelated } =
    useGetRelatedMealsQuery(mealId, {
      skip: !mealId || isApiLoading || !!apiError,
    });

  // Decide whether to use mock data or API data
  useEffect(() => {
    // If there's an error fetching from API or we're in development without a backend
    if (apiError || (process.env.NODE_ENV === "development" && !apiMeal)) {
      setUseMockData(true);
    }
  }, [apiError, apiMeal]);

  // Use either API data or mock data
  const meal = useMockData ? mockMeal : apiMeal;
  const relatedMeals = useMockData ? mockRelatedMeals : apiRelatedMeals;
  const isLoading = useMockData ? false : isApiLoading;
  const isLoadingRelated = useMockData ? false : isApiLoadingRelated;
  const error = useMockData ? null : apiError;

  // Animate page entry
  useEffect(() => {
    gsap.fromTo(
      ".page-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1);
  };

  // Only show error if we're not using mock data and have an error
  if (error && !isLoading && !useMockData) {
    return (
      <ErrorMessage
        title="Could not load meal details"
        message="There was a problem loading this meal. Please try again later."
        actionText="Back to Meals"
        onAction={handleBackClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-content">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-primary-600 hover:text-primary-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Meals
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-32">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Meal Detail Component */}
      {!isLoading && meal && (
        <MealDetail meal={meal} isLoading={isLoading} error={error} />
      )}

      {/* Vendor Info Section (if meal data is loaded) */}
      {meal && meal.vendor && (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {meal.vendor.name}
              </h2>
              <div className="flex items-start space-x-6">
                {meal.vendor.logoUrl && (
                  <img
                    src={meal.vendor.logoUrl}
                    alt={meal.vendor.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="text-gray-700 mb-4">
                    {meal.vendor?.description ||
                      "Information about this vendor is not available at the moment."}
                  </p>
                  <button
                    onClick={() => navigate(`/vendors/${meal.vendorId}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View All Meals from this Vendor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Meals Section */}
      {!isLoading && meal && (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You might also like
            </h2>

            {isLoadingRelated && (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner size="medium" />
              </div>
            )}

            {!isLoadingRelated && relatedMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedMeals.map((relatedMeal: any) => (
                  <MealCard key={relatedMeal.id} meal={relatedMeal} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic py-8">
                No related meals found. We're working on improving our
                recommendations.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Cart Component */}
      <Cart />
    </div>
  );
};

export default MealDetailPage;
