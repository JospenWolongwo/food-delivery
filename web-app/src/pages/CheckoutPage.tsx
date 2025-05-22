import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { RootState } from '../store';
import DeliveryDetailsStep from '../components/checkout/DeliveryDetailsStep';
import PaymentMethodStep from '../components/checkout/PaymentMethodStep';
import OrderSummaryStep from '../components/checkout/OrderSummaryStep';
import OrderConfirmationStep from '../components/checkout/OrderConfirmationStep';
import CheckoutProgress from '../components/checkout/CheckoutProgress';
import { checkoutService, DeliveryDetails, PaymentDetails } from '../services/checkoutService';
import { CartItem as StoreCartItem } from '../store/slices/cartSlice';

type CheckoutStep = 'delivery' | 'payment' | 'summary' | 'confirmation';

// Get mock data for development/testing
const mockCartItems = checkoutService.getMockCartItems();
const mockTotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Determine if we should use mock data or real data from Redux
  const { items: cartItems, total: cartTotal } = useSelector((state: RootState) => state.cart);
  
  // Helper to detect if we're in development mode using Vite's environment variables
  const isDev = () => {
    try {
      // @ts-ignore - Vite specific 
      return import.meta.env?.MODE === 'development';
    } catch (e) {
      return process.env.NODE_ENV === 'development';
    }
  };
  
  // Use real cart data if available, otherwise use mock data for development
  const items = cartItems.length > 0 ? cartItems : (isDev() ? mockCartItems : cartItems);
  const total = cartItems.length > 0 ? cartTotal : (isDev() ? mockTotal : cartTotal);
  
  // Get authentication data from Redux
  const authState = useSelector((state: RootState) => state.auth);
  const isAuthenticatedFromRedux = authState.isAuthenticated;
  const userFromRedux = authState.user;
  
  // Use real auth data if available, otherwise use mock data for development
  // This approach ensures the component works in both production and development
  const isAuthenticated = isDev() ? true : isAuthenticatedFromRedux;
  const user = isDev() && !userFromRedux ? checkoutService.getMockUser() : userFromRedux;
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [stepContainerRef] = useState(React.createRef<HTMLDivElement>());
  
  // Form state
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    address: '',
    campus: '',
    building: '',
    roomNumber: '',
    phoneNumber: user && 'phoneNumber' in user ? user.phoneNumber : '',
    deliveryInstructions: '',
    deliveryTime: 'asap',
  });
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    mobileMoneyProvider: '',
    mobileMoneyNumber: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    // For testing purposes, we'll comment out the authentication check
    // In production, uncomment this block
    /*
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
    } else 
    */
    if (items.length === 0 && currentStep !== 'confirmation') {
      navigate('/meals');
    }
  }, [isAuthenticated, items.length, navigate, currentStep]);
  
  // Animate step transitions
  useEffect(() => {
    if (stepContainerRef.current) {
      gsap.fromTo(
        stepContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentStep, stepContainerRef]);
  
  const goToStep = (step: CheckoutStep) => {
    if (step === 'delivery' || 
        (step === 'payment' && hasValidDeliveryDetails()) ||
        (step === 'summary' && hasValidDeliveryDetails() && hasValidPaymentDetails())) {
      setCurrentStep(step);
    }
  };
  
  const handleNextStep = () => {
    switch (currentStep) {
      case 'delivery':
        if (hasValidDeliveryDetails()) {
          setCurrentStep('payment');
        }
        break;
      case 'payment':
        if (hasValidPaymentDetails()) {
          setCurrentStep('summary');
        }
        break;
      case 'summary':
        handlePlaceOrder();
        break;
      case 'confirmation':
        navigate('/');
        break;
    }
  };
  
  const hasValidDeliveryDetails = (): boolean => {
    return !!(
      deliveryDetails.campus &&
      deliveryDetails.building &&
      deliveryDetails.roomNumber &&
      deliveryDetails.phoneNumber
    );
  };
  
  const hasValidPaymentDetails = (): boolean => {
    if (paymentDetails.method === 'credit-card') {
      return !!(
        paymentDetails.cardNumber &&
        paymentDetails.expiryDate &&
        paymentDetails.cvv &&
        paymentDetails.cardholderName
      );
    } else if (paymentDetails.method === 'mobile-money') {
      return !!(
        paymentDetails.mobileMoneyProvider &&
        paymentDetails.mobileMoneyNumber
      );
    } else if (paymentDetails.method === 'cash') {
      return true;
    }
    return false;
  };
  
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Use the checkout service to place the order
      // This will handle both real API calls and mock data
      const response = await checkoutService.placeOrder({
        items, 
        deliveryDetails, 
        paymentDetails, 
        total
      });
      
      if (response.success) {
        setOrderNumber(response.orderNumber);
        setCurrentStep('confirmation');
      } else {
        // Show error message
        alert(response.error || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'delivery':
        return (
          <DeliveryDetailsStep
            deliveryDetails={deliveryDetails}
            setDeliveryDetails={setDeliveryDetails}
            onContinue={handleNextStep}
          />
        );
      case 'payment':
        return (
          <PaymentMethodStep
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            onBack={() => setCurrentStep('delivery')}
            onContinue={handleNextStep}
          />
        );
      case 'summary':
        return (
          <OrderSummaryStep
            deliveryDetails={deliveryDetails}
            paymentDetails={paymentDetails}
            cartItems={items as any}
            cartTotal={total}
            onBack={() => setCurrentStep('payment')}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
          />
        );
      case 'confirmation':
        return (
          <OrderConfirmationStep
            orderNumber={orderNumber}
            onContinueShopping={() => navigate('/meals')}
          />
        );
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">Checkout</span>
        </h1>
        
        {currentStep !== 'confirmation' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
            <CheckoutProgress 
              currentStep={currentStep} 
              canNavigate={{ 
                delivery: true,
                payment: hasValidDeliveryDetails(),
                summary: hasValidDeliveryDetails() && hasValidPaymentDetails()
              }}
              onStepClick={goToStep}
            />
          </div>
        )}
        
        <div 
          ref={stepContainerRef} 
          className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
        >
          {renderCurrentStep()}
        </div>

        {/* Bottom Navigation Card */}
        {currentStep !== 'confirmation' && (
          <div className="mt-8 p-4 bg-white rounded-xl shadow-md flex justify-center space-x-4 transition-all duration-300 hover:shadow-lg">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Need help?</span> Contact support at <span className="text-primary-600">support@campusfood.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
