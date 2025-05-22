import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MealCard from "./MealCard";
import gsap from "gsap";

// Mock data for featured Cameroonian meals
const mockMeals = [
  {
    id: "1",
    name: "Ndolé",
    description:
      "Traditional Cameroonian dish made with stewed nuts, ndolé leaves, and fish or beef.",
    price: 3500,
    imageUrl: "/meals/ndole.jpg",
    isAvailable: true,
    rating: 4.9,
    reviewCount: 128,
    category: "Traditional",
    vendor: {
      name: "Mama Africa",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 580,
    },
  },
  {
    id: "2",
    name: "Poulet DG",
    description:
      "Directeur Général chicken - a delicious dish with chicken, plantains, and vegetables in a rich sauce.",
    price: 4200,
    imageUrl: "/meals/grilled-chicken.jpg",
    isAvailable: true,
    rating: 4.8,
    reviewCount: 95,
    category: "Traditional",
    vendor: {
      name: "Chez Pierre",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 650,
    },
  },
  {
    id: "3",
    name: "Borny fish",
    description: "Borny fish  with boboloh, peppers, and aromatic spices.",
    price: 3200,
    imageUrl: "/meals/borny-fish.jpg",
    isAvailable: true,
    rating: 4.6,
    reviewCount: 63,
    category: "Rice",
    vendor: {
      name: "Yaounde Dovv",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 520,
    },
  },
  {
    id: "4",
    name: "Okok",
    description: "Okok  with boboloh, peppers, and aromatic spices.",
    price: 3200,
    imageUrl: "/meals/okok.jpg",
    isAvailable: true,
    rating: 4.6,
    reviewCount: 63,
    category: "Okok",
    vendor: {
      name: "Yaounde Dovv",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 520,
    },
  },

  {
    id: "5",
    name: "Jollof Rice",
    description:
      "Spicy rice dish cooked with tomatoes, peppers, and aromatic spices, served with grilled chicken.",
    price: 3200,
    imageUrl: "/meals/jollof-rice.jpg",
    isAvailable: true,
    rating: 4.6,
    reviewCount: 63,
    category: "Rice",
    vendor: {
      name: "Yaoundé Express",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 520,
    },
  },
  {
    id: "6",
    name: "Yam",
    description:
      "Traditional yam made with a special spice blend and cow meat, served with palm oil.",
    price: 3800,
    imageUrl: "/meals/yam.jpg",
    isAvailable: true,
    rating: 4.5,
    reviewCount: 54,
    category: "Traditional",
    vendor: {
      name: "Bafoussam Delight",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 490,
    },
  },
  {
    id: "7",
    name: "Koki Beans",
    description:
      "Savory bean pudding made from black-eyed peas, wrapped in banana leaves and steamed to perfection.",
    price: 2800,
    imageUrl: "/meals/koki-beans.jpg",
    isAvailable: true,
    rating: 4.7,
    reviewCount: 42,
    category: "Traditional",
    vendor: {
      name: "Limbe Cuisine",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 380,
    },
  },
  {
    id: "8",
    name: "Egusi",
    description:
      "egusi pudding made from black-eyed peas, wrapped in banana leaves and steamed to perfection.",
    price: 2800,
    imageUrl: "/meals/egusi.jpg",
    isAvailable: true,
    rating: 4.7,
    reviewCount: 42,
    category: "Traditional",
    vendor: {
      name: "Limbe Cuisine",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 380,
    },
  },
  {
    id: "9",
    name: "Pilé",
    description:
      "Potatoes bean pudding made from black-eyed beans, pound with palm oil to perfection.",
    price: 2800,
    imageUrl: "/meals/pile.jpg",
    isAvailable: true,
    rating: 4.7,
    reviewCount: 42,
    category: "Traditional",
    vendor: {
      name: "Limbe Cuisine",
      logoUrl: "/images/vendor-placeholder.svg",
    },
    nutritionalInfo: {
      calories: 380,
    },
  },
];

const FeaturedMeals: React.FC = () => {
  console.log("FeaturedMeals component rendering");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Using mock data instead of API call
  const data = { items: mockMeals };
  const isLoading = false;
  const error = null;

  // Animation on component mount - only animate opacity to prevent style conflicts
  useEffect(() => {
    if (sectionRef.current && !isLoading && data) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isLoading, data]);

  if (isLoading) {
    return (
      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Meals
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Loading our top-rated meals...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
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
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Meals
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              We're having trouble loading our featured meals right now.
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/meals"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
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
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Meals
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              No meals available at the moment. Check back soon!
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/meals"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse All Meals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Meals
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Discover our highest-rated and most popular meals
          </p>
        </div>

        {/* Simple 3x2 grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display all meals in a consistent 3x2 grid */}
          {data.items.map((meal) => (
            <div key={meal.id} className="h-full">
              <MealCard meal={meal} featured={false} />
            </div>
          ))}
        </div>

        <div className="w-full mt-12 text-center">
          <Link
            to="/meals"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            View All Meals
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMeals;
