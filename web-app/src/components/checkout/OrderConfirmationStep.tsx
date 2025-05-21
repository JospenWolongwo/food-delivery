import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';

interface OrderConfirmationStepProps {
  orderNumber: string;
  onContinueShopping: () => void;
}

const OrderConfirmationStep: React.FC<OrderConfirmationStepProps> = ({
  orderNumber,
  onContinueShopping
}) => {
  const dispatch = useDispatch();
  
  // Clear the cart once order is confirmed
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  
  // Animation for the confirmation page
  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    timeline.fromTo(
      '.success-icon',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 }
    ).fromTo(
      '.confirmation-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    ).fromTo(
      '.tracking-info',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    ).fromTo(
      '.confirmation-actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    );
  }, []);
  
  // Estimated delivery time (30-45 minutes from now)
  const now = new Date();
  const minDeliveryTime = new Date(now.getTime() + 30 * 60000);
  const maxDeliveryTime = new Date(now.getTime() + 45 * 60000);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="px-4 py-10 sm:px-6 text-center">
      {/* Success Icon */}
      <div className="success-icon mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      {/* Confirmation Message */}
      <div className="confirmation-content">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your order has been received and is being prepared.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 inline-block mb-6">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-xl font-medium text-gray-900">{orderNumber}</p>
        </div>
      </div>
      
      {/* Tracking Info */}
      <div className="tracking-info mb-8">
        <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Information</h3>
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Delivery Time:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatTime(minDeliveryTime)} - {formatTime(maxDeliveryTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Preparing
              </span>
            </div>
          </div>
          
          {/* Order Progress */}
          <div className="mt-4">
            <div className="relative pt-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Confirmed</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Preparing</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">On the way</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Delivered</span>
                </div>
              </div>
              <div className="absolute top-8 left-0 right-0 h-0.5 flex">
                <div className="h-full bg-indigo-600 w-1/6"></div>
                <div className="h-full bg-gray-200 flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="confirmation-actions">
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <button
            onClick={onContinueShopping}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.location.href = '/orders'}
            className="flex-1 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Track Order
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>A confirmation has been sent to your email and phone.</p>
          <p className="mt-1">Need help? Contact our <a href="/support" className="text-indigo-600 hover:text-indigo-700">support team</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationStep;
