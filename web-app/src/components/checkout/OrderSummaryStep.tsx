import React from 'react';
import { DeliveryDetails, PaymentDetails } from '../../services/checkoutService';

// Define the CartItem interface for this component
interface CartItem {
  mealId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string; // Make imageUrl optional to be compatible with both types
  vendorName?: string;
  specialInstructions?: string;
}

interface OrderSummaryStepProps {
  deliveryDetails: DeliveryDetails;
  paymentDetails: PaymentDetails;
  cartItems: CartItem[];
  cartTotal: number;
  onBack: () => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

const OrderSummaryStep: React.FC<OrderSummaryStepProps> = ({
  deliveryDetails,
  paymentDetails,
  cartItems,
  cartTotal,
  onBack,
  onPlaceOrder,
  isSubmitting
}) => {
  // Format payment method display
  const getPaymentMethodDisplay = () => {
    if (paymentDetails.method === 'credit-card') {
      const lastFourDigits = paymentDetails.cardNumber?.replace(/\s/g, '').slice(-4) || '';
      return `Credit Card (ending in ${lastFourDigits})`;
    } else if (paymentDetails.method === 'mobile-money') {
      const provider = paymentDetails.mobileMoneyProvider === 'orange-money'
        ? 'Orange Money'
        : paymentDetails.mobileMoneyProvider === 'mtn-momo'
          ? 'MTN Mobile Money'
          : 'Moov Money';
      return `${provider} (${paymentDetails.mobileMoneyNumber})`;
    } else if (paymentDetails.method === 'cash') {
      return 'Cash on Delivery';
    }
    return 'Unknown payment method';
  };

  // Get building display name
  const getBuildingDisplayName = (buildingId: string) => {
    const buildingMap: Record<string, string> = {
      'academic-block-a': 'Academic Block A',
      'academic-block-b': 'Academic Block B',
      'library': 'Library',
      'student-center': 'Student Center',
      'residence-hall-1': 'Residence Hall 1',
      'residence-hall-2': 'Residence Hall 2',
      'arts-building': 'Arts Building',
      'science-complex': 'Science Complex',
      'residence-hall-n1': 'Residence Hall N1',
      'residence-hall-n2': 'Residence Hall N2',
      'main-building': 'Main Building',
      'residence-hall': 'Residence Hall',
      'cafeteria': 'Cafeteria'
    };
    
    return buildingMap[buildingId] || buildingId;
  };

  // Get campus display name
  const getCampusDisplayName = (campusId: string) => {
    const campusMap: Record<string, string> = {
      'main': 'Main Campus',
      'north': 'North Campus',
      'south': 'South Campus',
      'east': 'East Campus',
      'west': 'West Campus'
    };
    
    return campusMap[campusId] || campusId;
  };

  // Calculate subtotal
  const subtotal = cartTotal;
  
  // Calculate delivery fee
  const deliveryFee = 500; // 500 FCFA
  
  // Calculate total
  const total = subtotal + deliveryFee;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-8">
        {/* Delivery Details Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Details</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Location</div>
                <div className="mt-1">
                  <p className="text-gray-800">
                    {getCampusDisplayName(deliveryDetails.campus)}
                  </p>
                  <p className="text-gray-800">
                    {getBuildingDisplayName(deliveryDetails.building)}, Room {deliveryDetails.roomNumber}
                  </p>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Contact</div>
                <div className="mt-1">
                  <p className="text-gray-800">{deliveryDetails.phoneNumber}</p>
                </div>
              </div>
            </div>
            
            {deliveryDetails.deliveryInstructions && (
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-500">Delivery Instructions</div>
                <div className="mt-1">
                  <p className="text-gray-800">{deliveryDetails.deliveryInstructions}</p>
                </div>
              </div>
            )}
            
            <div className="mt-3">
              <div className="text-sm font-medium text-gray-500">Delivery Time</div>
              <div className="mt-1">
                <p className="text-gray-800">
                  {deliveryDetails.deliveryTime === 'asap'
                    ? 'As soon as possible'
                    : 'Scheduled for later'}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Payment Method Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800">{getPaymentMethodDisplay()}</p>
          </div>
        </section>
        
        {/* Order Items Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.mealId} className="p-4 flex items-start">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="mt-1 text-xs text-gray-500">{item.vendorName}</p>
                        {item.specialInstructions && (
                          <p className="mt-1 text-xs italic text-gray-500">
                            "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-gray-900">
                          {item.price.toLocaleString()} FCFA
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        
        {/* Order Summary Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Order Total</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-800">{subtotal.toLocaleString()} FCFA</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Delivery Fee</p>
                <p className="text-gray-800">{deliveryFee.toLocaleString()} FCFA</p>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <p className="text-gray-900">Total</p>
                  <p className="text-gray-900">{total.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={isSubmitting}
            className={`
              flex-1 py-3 rounded-md font-medium text-white
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}
              transition-colors duration-200 flex items-center justify-center
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className={`
              flex-1 py-3 border border-gray-300 rounded-md text-gray-700 font-medium 
              ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}
              transition-colors duration-200
            `}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryStep;
