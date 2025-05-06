import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMealByIdQuery } from '../../store/api/mealsApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import gsap from 'gsap';

const MealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mealId = parseInt(id || '0');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'nutritional'>('description');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { data: meal, isLoading, error } = useGetMealByIdQuery(mealId);
  
  useEffect(() => {
    // Animate components when meal data loads
    if (meal && containerRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      )
        .fromTo(
          imageRef.current,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          "-=0.3"
        )
        .fromTo(
          contentRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          "-=0.6"
        )
        .fromTo(
          '.meal-detail-action',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          "-=0.4"
        );
    }
  }, [meal]);
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const handleAddToCart = () => {
    if (meal) {
      dispatch(addToCart({
        mealId: meal.id,
        name: meal.name,
        price: meal.price,
        quantity,
        imageUrl: meal.imageUrl,
        vendorName: meal.vendor?.name || '',
        specialInstructions: specialInstructions.trim() || undefined
      }));
      
      // Provide visual feedback
      gsap.to('.add-to-cart-btn', {
        backgroundColor: '#4F46E5', // Indigo-700
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }
  };
  
  const renderTabContent = () => {
    if (!meal) return null;
    
    switch (activeTab) {
      case 'description':
        return <p className="text-gray-700">{meal.description}</p>;
      case 'ingredients':
        return (
          <div>
            {meal.ingredients && meal.ingredients.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ingredient information available.</p>
            )}
            
            {meal.allergens && meal.allergens.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-600 mb-1">Allergens:</h4>
                <div className="flex flex-wrap gap-2">
                  {meal.allergens.map((allergen, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'nutritional':
        return (
          <div>
            {meal.nutritionalInfo ? (
              <div className="grid grid-cols-2 gap-4">
                {meal.nutritionalInfo.calories !== undefined && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-orange-800 font-medium">Calories</div>
                    <div className="text-2xl font-bold text-orange-900">{meal.nutritionalInfo.calories}</div>
                  </div>
                )}
                {meal.nutritionalInfo.protein !== undefined && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-green-800 font-medium">Protein</div>
                    <div className="text-2xl font-bold text-green-900">{meal.nutritionalInfo.protein}g</div>
                  </div>
                )}
                {meal.nutritionalInfo.carbs !== undefined && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-blue-800 font-medium">Carbs</div>
                    <div className="text-2xl font-bold text-blue-900">{meal.nutritionalInfo.carbs}g</div>
                  </div>
                )}
                {meal.nutritionalInfo.fat !== undefined && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-yellow-800 font-medium">Fat</div>
                    <div className="text-2xl font-bold text-yellow-900">{meal.nutritionalInfo.fat}g</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No nutritional information available.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error || !meal) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <h3 className="text-lg font-medium mb-2">Error Loading Meal</h3>
          <p>We couldn't find the meal you're looking for. It may have been removed or is temporarily unavailable.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Meal Image */}
          <div className="md:w-1/2">
            <div className="relative h-full">
              <img
                ref={imageRef}
                src={meal.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image+Available'}
                alt={meal.name}
                className="w-full h-full object-cover"
                style={{ maxHeight: '500px' }}
              />
              {meal.isAvailable ? (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  Available
                </span>
              ) : (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  Unavailable
                </span>
              )}
              {meal.category && (
                <span className="absolute top-4 left-4 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {meal.category}
                </span>
              )}
            </div>
          </div>
          
          {/* Meal Content */}
          <div ref={contentRef} className="md:w-1/2 p-8">
            <div className="mb-6">
              {meal.vendor && (
                <div className="flex items-center mb-2">
                  <img
                    src={meal.vendor.logoUrl || 'https://via.placeholder.com/40?text=V'}
                    alt={meal.vendor.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span 
                    className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    onClick={() => navigate(`/vendors/${meal.vendorId}`)}
                  >
                    {meal.vendor.name}
                  </span>
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{meal.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-gray-600">
                    {meal.rating || '4.5'} ({meal.reviewCount || '10'} reviews)
                  </span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  ${meal.price.toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-4 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-4 border-b-2 font-medium text-sm ${activeTab === 'ingredients' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Ingredients & Allergens
                </button>
                <button
                  onClick={() => setActiveTab('nutritional')}
                  className={`pb-4 border-b-2 font-medium text-sm ${activeTab === 'nutritional' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Nutritional Info
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="mb-8 min-h-[150px]">
              {renderTabContent()}
            </div>
            
            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="meal-detail-action">
                <label htmlFor="special-instructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  id="special-instructions"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Any special requests or dietary concerns?"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
              
              <div className="meal-detail-action flex items-center">
                <div className="mr-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="custom-number-input flex">
                    <button
                      onClick={decrementQuantity}
                      className="bg-gray-200 text-gray-600 hover:bg-gray-300 h-10 w-10 rounded-l-lg flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      className="h-10 w-16 border-t border-b border-gray-300 text-center [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="bg-gray-200 text-gray-600 hover:bg-gray-300 h-10 w-10 rounded-r-lg flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <button
                    onClick={handleAddToCart}
                    disabled={!meal.isAvailable}
                    className={`add-to-cart-btn w-full py-3 px-4 rounded-lg font-medium text-white ${meal.isAvailable ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'} transition-colors flex items-center justify-center`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {meal.isAvailable ? (
                      <span>Add to Cart - ${(meal.price * quantity).toFixed(2)}</span>
                    ) : (
                      <span>Currently Unavailable</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
