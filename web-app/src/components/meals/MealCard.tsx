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
  
  if (!meal) {
    return (
      <div className="animate-pulse rounded-lg bg-gray-200 h-64 w-full"></div>
    );
  }

  // Format price as FCFA (West African CFA franc)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' FCFA';
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-lg overflow-hidden shadow-md bg-white transition-all h-full flex flex-col hover:shadow-lg ${
        featured ? 'md:flex-row' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/meals/${meal.id}`} className="block h-full w-full">
        <div className={`relative ${featured ? 'md:w-1/2 md:h-full' : 'w-full'}`}>
          <img
            src={meal.imageUrl || '/images/meal-placeholder.svg'}
            alt={meal.name}
            className={`w-full h-48 object-cover ${
              featured ? 'md:h-full' : ''
            }`}
            onError={(e) => {
              e.currentTarget.src = '/images/meal-placeholder.svg';
            }}
          />
          {meal.isAvailable !== false ? (
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
          {meal.vendor?.name && (
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
              {meal.vendor.name}
            </span>
          )}
        </div>
        
        <div className={`p-4 ${featured ? 'md:w-1/2' : ''} flex flex-col flex-1`}>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{meal.name}</h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{meal.description}</p>
            
            <div className="flex items-center mb-4">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">
                {meal.rating || '4.5'} ({meal.reviewCount || '10'})
              </span>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(meal.price)}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={meal.isAvailable === false}
                className={`px-4 py-2 rounded-md font-medium text-sm ${
                  meal.isAvailable === false
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {meal.isAvailable === false ? 'Unavailable' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MealCard;
