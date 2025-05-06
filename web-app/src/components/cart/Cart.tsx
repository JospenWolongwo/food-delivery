import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeItem,
  updateQuantity,
  clearCart,
  closeCart,
  CartItem
} from '../../store/slices/cartSlice';
import { RootState } from '../../store';
import gsap from 'gsap';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const { items, total, isOpen } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Animation for opening/closing cart
  useEffect(() => {
    if (cartRef.current && overlayRef.current) {
      if (isOpen) {
        // Open cart animation
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          display: 'block'
        });
        
        gsap.fromTo(
          cartRef.current,
          { x: '100%' },
          { x: '0%', duration: 0.4, ease: 'power2.out' }
        );
      } else {
        // Close cart animation
        gsap.to(cartRef.current, {
          x: '100%',
          duration: 0.4,
          ease: 'power2.in'
        });
        
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(overlayRef.current, { display: 'none' });
          }
        });
      }
    }
  }, [isOpen]);
  
  // Close the cart when clicking outside
  const handleOverlayClick = () => {
    dispatch(closeCart());
  };
  
  // Handle quantity update
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ mealId: item.mealId, quantity: newQuantity }));
    } else {
      dispatch(removeItem(item.mealId));
    }
  };
  
  // Remove item from cart
  const handleRemoveItem = (item: CartItem) => {
    dispatch(removeItem(item.mealId));
  };
  
  // Clear all items from cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    if (isAuthenticated) {
      dispatch(closeCart());
      navigate('/checkout');
    } else {
      dispatch(closeCart());
      navigate('/login', { state: { redirectTo: '/checkout' } });
    }
  };
  
  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"
        onClick={handleOverlayClick}
      />
      
      {/* Cart Panel */}
      <div
        ref={cartRef}
        className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 transform translate-x-full"
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-indigo-600 text-white">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button
              onClick={() => dispatch(closeCart())}
              className="text-white p-1 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-2">Add some delicious meals to get started</p>
                <button
                  onClick={() => {
                    dispatch(closeCart());
                    navigate('/meals');
                  }}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Browse Meals
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.mealId}
                    className="flex border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover"
                      />
                    )}
                    <div className="flex-1 p-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      
                      {item.vendorName && (
                        <p className="text-xs text-gray-500 mb-2">{item.vendorName}</p>
                      )}
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                      
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-700 mt-4 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span className="font-medium">Delivery Fee:</span>
                <span className="font-bold">$2.99</span>
              </div>
              
              <div className="flex justify-between mb-4 text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">${(total + 2.99).toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => {
                  dispatch(closeCart());
                  navigate('/meals');
                }}
                className="w-full mt-2 py-2 text-indigo-600 rounded-md font-medium hover:bg-indigo-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
