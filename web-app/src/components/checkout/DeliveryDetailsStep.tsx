import React from 'react';

interface DeliveryDetails {
  address: string;
  campus: string;
  building: string;
  roomNumber: string;
  phoneNumber: string;
  deliveryInstructions: string;
  deliveryTime: string;
}

interface DeliveryDetailsStepProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: React.Dispatch<React.SetStateAction<DeliveryDetails>>;
  onContinue: () => void;
}

const DeliveryDetailsStep: React.FC<DeliveryDetailsStepProps> = ({
  deliveryDetails,
  setDeliveryDetails,
  onContinue
}) => {
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const isFormValid = () => {
    return !!(
      deliveryDetails.campus &&
      deliveryDetails.building &&
      deliveryDetails.roomNumber &&
      deliveryDetails.phoneNumber
    );
  };

  return (
    <div className="px-6 py-8 sm:px-8 sm:py-10 transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Delivery Details</h2>
      
      <form 
        className="space-y-8" 
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid()) {
            onContinue();
          }
        }}
      >
        <div className="grid gap-8 md:grid-cols-2">
          {/* Campus Selection */}
          <div className="col-span-full">
            <label htmlFor="campus" className="block text-sm font-semibold text-gray-700 mb-2">
              Campus <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                id="campus"
                name="campus"
                value={deliveryDetails.campus}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white 
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 
                       transition-all duration-200 shadow-sm"
                required
              >
                <option value="">Select Campus</option>
                <option value="main">Main Campus</option>
                <option value="north">North Campus</option>
                <option value="south">South Campus</option>
                <option value="east">East Campus</option>
                <option value="west">West Campus</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Building Selection */}
          <div className="col-span-full md:col-span-1">
            <label htmlFor="building" className="block text-sm font-semibold text-gray-700 mb-2">
              Building <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                id="building"
                name="building"
                value={deliveryDetails.building}
                onChange={handleChange}
                className={`appearance-none block w-full px-4 py-3 rounded-lg border 
                       ${!deliveryDetails.campus ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800'} 
                       border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 
                       transition-all duration-200 shadow-sm`}
                required
                disabled={!deliveryDetails.campus}
              >
                <option value="">Select Building</option>
                {deliveryDetails.campus === 'main' && (
                  <>
                    <option value="academic-block-a">Academic Block A</option>
                    <option value="academic-block-b">Academic Block B</option>
                    <option value="library">Library</option>
                    <option value="student-center">Student Center</option>
                    <option value="residence-hall-1">Residence Hall 1</option>
                    <option value="residence-hall-2">Residence Hall 2</option>
                  </>
                )}
                {deliveryDetails.campus === 'north' && (
                  <>
                    <option value="arts-building">Arts Building</option>
                    <option value="science-complex">Science Complex</option>
                    <option value="residence-hall-n1">Residence Hall N1</option>
                    <option value="residence-hall-n2">Residence Hall N2</option>
                  </>
                )}
                {(deliveryDetails.campus === 'south' || 
                  deliveryDetails.campus === 'east' || 
                  deliveryDetails.campus === 'west') && (
                  <>
                    <option value="main-building">Main Building</option>
                    <option value="admin-building">Admin Building</option>
                    <option value="residence-hall">Residence Hall</option>
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Room Number */}
          <div className="col-span-full md:col-span-1">
            <label htmlFor="roomNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Room Number <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={deliveryDetails.roomNumber}
              onChange={handleChange}
              placeholder="e.g. 101, B24, etc."
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                     placeholder-gray-400 transition-all duration-200"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="col-span-full">
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={deliveryDetails.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. 2376XXXXXXXX"
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                     placeholder-gray-400 transition-all duration-200"
              required
            />
            <p className="mt-2 text-sm text-gray-500 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              We'll contact you at this number for delivery updates
            </p>
          </div>

          {/* Delivery Instructions */}
          <div className="col-span-full">
            <label htmlFor="deliveryInstructions" className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Instructions
            </label>
            <textarea
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={deliveryDetails.deliveryInstructions}
              onChange={handleChange}
              placeholder="Any specific instructions for the delivery person? e.g. landmarks, directions, etc."
              rows={3}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                     placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Delivery Time */}
          <div className="col-span-full">
            <label htmlFor="deliveryTime" className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Time
            </label>
            <div className="relative">
              <select
                id="deliveryTime"
                name="deliveryTime"
                value={deliveryDetails.deliveryTime}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white 
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 
                       transition-all duration-200 shadow-sm"
              >
                <option value="asap">As soon as possible</option>
                <option value="scheduled">Schedule for later</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {deliveryDetails.deliveryTime === 'scheduled' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-primary-50 p-4 rounded-lg animate-fadeIn">
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                           transition-all duration-200 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryTimeSlot" className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <select
                      id="deliveryTimeSlot"
                      name="deliveryTimeSlot"
                      className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 
                             bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 
                             focus:border-primary-500 transition-all duration-200 shadow-sm"
                    >
                      <option value="morning">Morning (8 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`
              w-full py-4 rounded-lg font-semibold text-white text-base
              shadow-md transition-all duration-300 transform hover:translate-y-[-2px]
              ${isFormValid() 
                ? 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800' 
                : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryDetailsStep;
