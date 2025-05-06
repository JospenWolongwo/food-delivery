import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MealDetail from '../components/meals/MealDetail';
import Cart from '../components/cart/Cart';
import { useGetMealByIdQuery } from '../store/api/mealsApi';

const MealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mealId = parseInt(id || '0');
  const navigate = useNavigate();
  
  const { data: meal, isLoading, error } = useGetMealByIdQuery(mealId);
  
  // Handle back button click
  const handleBackClick = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={handleBackClick}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Meals
        </button>
      </div>
      
      {/* Meal Detail Component */}
      <MealDetail />
      
      {/* Vendor Info Section (if meal data is loaded) */}
      {meal && meal.vendor && (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {meal.vendor.name}</h2>
              <div className="flex items-start space-x-6">
                {meal.vendor.logoUrl && (
                  <img 
                    src={meal.vendor.logoUrl} 
                    alt={meal.vendor.name} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div>
                  <p className="text-gray-700 mb-4">{meal.vendor.description || 'Information about this vendor is not available at the moment.'}</p>
                  <button 
                    onClick={() => navigate(`/vendors/${meal.vendorId}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      {meal && (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <p className="text-center text-gray-500 italic">Similar meals will be shown here based on your preferences and browsing history.</p>
          </div>
        </div>
      )}
      
      {/* Cart Component */}
      <Cart />
    </div>
  );
};

export default MealDetailPage;
