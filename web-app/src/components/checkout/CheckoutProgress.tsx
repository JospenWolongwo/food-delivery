import React from 'react';

interface CheckoutProgressProps {
  currentStep: 'delivery' | 'payment' | 'summary' | 'confirmation';
  canNavigate: {
    delivery: boolean;
    payment: boolean;
    summary: boolean;
  };
  onStepClick: (step: 'delivery' | 'payment' | 'summary') => void;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ 
  currentStep, 
  canNavigate,
  onStepClick 
}) => {
  // Define steps with their display text
  const steps = [
    { id: 'delivery', label: 'Delivery Details' },
    { id: 'payment', label: 'Payment Method' },
    { id: 'summary', label: 'Order Summary' },
  ] as const;

  // Determine the index of the current step
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="py-6 px-4 sm:px-8 mb-2">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, index) => {
            // Determine step status
            const isActive = step.id === currentStep;
            const isComplete = index < currentStepIndex;
            const isClickable = canNavigate[step.id];
            const isLast = index === steps.length - 1;

            return (
              <li key={step.id} className={`relative ${!isLast ? 'pr-8 sm:pr-20 flex-grow' : ''}`}>
                <div className="flex items-center">
                  {/* Step Circle */}
                  <button
                    onClick={() => isClickable ? onStepClick(step.id) : undefined}
                    disabled={!isClickable}
                    className={`
                      relative z-10 flex items-center justify-center
                      w-10 h-10 rounded-full text-sm font-bold
                      shadow-sm transition-all duration-300
                      ${isComplete 
                        ? 'bg-indigo-600 text-white scale-105 shadow-indigo-200' 
                        : isActive 
                          ? 'border-2 border-indigo-600 text-indigo-600 bg-indigo-50 scale-110 shadow-md' 
                          : 'border-2 border-gray-300 text-gray-500 bg-white'}
                      ${isClickable && !isActive && !isComplete ? 'hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 cursor-pointer' : ''}
                      ${!isClickable && !isActive && !isComplete ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isComplete ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </button>
                  
                  {/* Step Line */}
                  {!isLast && (
                    <div className="relative flex-grow mx-2 sm:mx-4">
                      <div 
                        className={`
                          absolute top-5 h-1 rounded-full w-full
                          ${index < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-200'}
                          transition-colors duration-500
                        `}
                      />
                    </div>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <button
                    onClick={() => isClickable ? onStepClick(step.id) : undefined}
                    disabled={!isClickable}
                    className={`
                      text-sm font-medium whitespace-nowrap
                      ${isActive ? 'text-indigo-800 font-semibold' : isComplete ? 'text-gray-900' : 'text-gray-500'}
                      ${isClickable && !isActive ? 'hover:text-indigo-700 cursor-pointer' : ''}
                      ${!isClickable && !isActive ? 'opacity-70 cursor-not-allowed' : ''}
                      transition-all duration-300
                      ${isActive ? 'scale-105' : ''}
                    `}
                  >
                    {step.label}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default CheckoutProgress;
