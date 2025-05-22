import React, { useState } from 'react';
import { gsap } from 'gsap';

interface PaymentDetails {
  method: 'credit-card' | 'mobile-money' | 'cash' | '';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  mobileMoneyProvider?: string;
  mobileMoneyNumber?: string;
}

interface PaymentMethodStepProps {
  paymentDetails: PaymentDetails;
  setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>;
  onBack: () => void;
  onContinue: () => void;
}

const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
  paymentDetails,
  setPaymentDetails,
  onBack,
  onContinue
}) => {
  const [formRefs] = useState({
    creditCard: React.createRef<HTMLDivElement>(),
    mobileMoney: React.createRef<HTMLDivElement>()
  });

  // Handle payment method selection
  const handleMethodChange = (method: 'credit-card' | 'mobile-money' | 'cash') => {
    setPaymentDetails(prev => ({ ...prev, method }));
    
    // Animate form transitions
    if (method === 'credit-card' && formRefs.creditCard.current) {
      gsap.fromTo(
        formRefs.creditCard.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    } else if (method === 'mobile-money' && formRefs.mobileMoney.current) {
      gsap.fromTo(
        formRefs.mobileMoney.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .match(/.{1,4}/g)
      ?.join(' ')
      .substr(0, 19) || '';
  };

  // Handle credit card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentDetails(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 3) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    } else {
      return cleanValue;
    }
  };

  // Handle expiry date input
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setPaymentDetails(prev => ({ ...prev, expiryDate: formattedValue }));
  };

  // Validate form data
  const isFormValid = () => {
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

  return (
    <div className="px-6 py-8 sm:px-8 sm:py-10 transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Method</h2>
      
      <form 
        className="space-y-8" 
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid()) {
            onContinue();
          }
        }}
      >
        {/* Payment Method Selection */}
        <div className="space-y-6">
          <div className="text-lg font-semibold text-gray-800 mb-3">Select Payment Method</div>
          
          {/* Credit Card Option */}
          <div 
            className={`
              border-2 rounded-lg p-5 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
              ${paymentDetails.method === 'credit-card' 
                ? 'border-primary-500 bg-primary-50/70 shadow-md' 
                : 'border-gray-200 hover:border-primary-200'}
            `}
            onClick={() => handleMethodChange('credit-card')}
          >
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <input
                type="radio"
                id="credit-card"
                name="paymentMethod"
                checked={paymentDetails.method === 'credit-card'}
                onChange={() => handleMethodChange('credit-card')}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="credit-card" className="ml-3 cursor-pointer">
                <span className="font-semibold text-gray-900">Credit Card</span>
              </label>
            </div>
            
            {/* Credit Card Form */}
            {paymentDetails.method === 'credit-card' && (
              <div ref={formRefs.creditCard} className="mt-6 grid grid-cols-1 gap-y-5 animate-fadeIn">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={paymentDetails.cardNumber || ''}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                           placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={paymentDetails.expiryDate || ''}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                             placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentDetails.cvv || ''}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={4}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                             placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    value={paymentDetails.cardholderName || ''}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                           placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Money Option */}
          <div 
            className={`
              border-2 rounded-lg p-5 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
              ${paymentDetails.method === 'mobile-money' 
                ? 'border-primary-500 bg-primary-50/70 shadow-md' 
                : 'border-gray-200 hover:border-primary-200'}
            `}
            onClick={() => handleMethodChange('mobile-money')}
          >
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="radio"
                id="mobile-money"
                name="paymentMethod"
                checked={paymentDetails.method === 'mobile-money'}
                onChange={() => handleMethodChange('mobile-money')}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="mobile-money" className="ml-3 cursor-pointer">
                <span className="font-semibold text-gray-900">Mobile Money</span>
              </label>
            </div>
            
            {/* Mobile Money Form */}
            {paymentDetails.method === 'mobile-money' && (
              <div ref={formRefs.mobileMoney} className="mt-6 grid grid-cols-1 gap-y-5 animate-fadeIn">
                <div>
                  <label htmlFor="mobileMoneyProvider" className="block text-sm font-semibold text-gray-700 mb-2">
                    Provider
                  </label>
                  <div className="relative">
                    <select
                      id="mobileMoneyProvider"
                      name="mobileMoneyProvider"
                      value={paymentDetails.mobileMoneyProvider || ''}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white 
                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 
                             transition-all duration-200 shadow-sm"
                      required
                    >
                      <option value="">Select Provider</option>
                      <option value="orange-money">Orange Money</option>
                      <option value="mtn-momo">MTN Mobile Money</option>
                      <option value="moov-money">Moov Money</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="mobileMoneyNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    id="mobileMoneyNumber"
                    name="mobileMoneyNumber"
                    value={paymentDetails.mobileMoneyNumber || ''}
                    onChange={handleChange}
                    placeholder="e.g. 237XXXXXXXXX"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                           placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Cash on Delivery Option */}
          <div 
            className={`
              border-2 rounded-lg p-5 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md
              ${paymentDetails.method === 'cash' 
                ? 'border-primary-500 bg-primary-50/70 shadow-md' 
                : 'border-gray-200 hover:border-primary-200'}
            `}
            onClick={() => handleMethodChange('cash')}
          >
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                checked={paymentDetails.method === 'cash'}
                onChange={() => handleMethodChange('cash')}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="cash" className="ml-3 cursor-pointer">
                <span className="font-semibold text-gray-900">Cash on Delivery</span>
                <p className="text-sm text-gray-500 mt-1">Pay with cash upon delivery to your campus</p>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row-reverse gap-4">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`
              sm:flex-1 py-4 rounded-lg font-semibold text-white text-base
              shadow-md transition-all duration-300 transform hover:translate-y-[-2px]
              ${isFormValid() 
                ? 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800' 
                : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            Continue to Review
          </button>
          <button
            type="button"
            onClick={onBack}
            className="sm:flex-1 py-4 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold 
                     hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-base"
          >
            Back to Delivery
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodStep;
