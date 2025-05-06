import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store';
import gsap from 'gsap';

const CartButton: React.FC = () => {
  const dispatch = useDispatch();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { items, total } = useSelector((state: RootState) => state.cart);
  
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Animation when item count changes
  useEffect(() => {
    if (buttonRef.current && itemCount > 0) {
      // Create a bounce animation
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.9 },
        { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.5)' }
      );
    }
  }, [itemCount]);
  
  return (
    <button
      ref={buttonRef}
      onClick={() => dispatch(toggleCart())}
      className="relative p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
      aria-label="Open cart"
    >
      <svg 
        className="w-7 h-7" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      
      {total > 0 && (
        <span className="hidden md:inline-block ml-2 text-sm font-medium">
          ${total.toFixed(2)}
        </span>
      )}
    </button>
  );
};

export default CartButton;
