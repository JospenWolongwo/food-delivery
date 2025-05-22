import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { Meal } from '../../store/api/mealsApi';
import gsap from 'gsap';

interface MealCardProps {
  meal: Meal;
  featured?: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ meal, featured = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Animation on mount - only animate opacity to prevent style conflicts
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);
  
  // Interactive animations on hover - only animate boxShadow to prevent style conflicts
  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      mealId: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      imageUrl: meal.imageUrl,
      vendorName: meal.vendor?.name || '',
    }));
    
    // Add animation feedback for the add to cart action
    if (cardRef.current) {
      const timeline = gsap.timeline();
      timeline
        .to(cardRef.current, { scale: 1.05, duration: 0.2 })
        .to(cardRef.current, { scale: 1, duration: 0.2 });
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={`rounded-lg overflow-hidden shadow-md bg-white transition-all h-full ${featured ? 'md:flex' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/meals/${meal.id}`} className="block h-full w-full">
        <div className={`relative ${featured ? 'md:w-1/2 md:h-full' : 'w-full'}`}>
          <img
            src={meal.imageUrl || '/images/meal-placeholder.svg'}
            alt={meal.name}
            className={`w-full h-48 object-cover ${featured ? 'md:h-full' : ''}`}
            onError={(e) => {
              e.currentTarget.src = '/images/meal-placeholder.svg';
            }}
          />
          {meal.isAvailable ? (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Available
            </span>
          ) : (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Unavailable
            </span>
          )}
          {featured && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
        
        <div className={`p-4 ${featured ? 'md:w-1/2 md:flex md:flex-col md:justify-between' : ''}`}>
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{meal.name}</h3>
              <p className="text-lg font-bold text-primary-600">{meal.price.toFixed(0)} FCFA</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meal.description}</p>
            
            {meal.vendor && (
              <div className="flex items-center mb-3">
                <img
                  src={meal.vendor.logoUrl || '/images/vendor-placeholder.svg'}
                  alt={meal.vendor.name}
                  className="w-6 h-6 rounded-full mr-2 bg-primary-100"
                  onError={(e) => {
                    e.currentTarget.src = '/images/vendor-placeholder.svg';
                  }}
                />
                <span className="text-xs text-gray-500">{meal.vendor.name}</span>
              </div>
            )}
            
            {meal.category && (
              <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                {meal.category}
              </span>
            )}
            
            {meal.nutritionalInfo?.calories && (
              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                {meal.nutritionalInfo.calories} cal
              </span>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">
                {meal.rating || '4.5'} ({meal.reviewCount || '10'})
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MealCard;
