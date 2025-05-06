import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetProfileQuery } from '../../store/api/authApi';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  // Fetch the latest user profile when the component mounts
  const { data: profileData, isLoading, error } = useGetProfileQuery();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Animation effect
  useEffect(() => {
    if (!isLoading && profileData) {
      const timeline = gsap.timeline();
      
      timeline
        .fromTo('.profile-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.profile-section', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, '-=0.3');
    }
  }, [isLoading, profileData]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-center">
          <svg
            className="w-12 h-12 mx-auto text-indigo-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-100 rounded-md">
          <h2 className="text-xl font-semibold text-red-800">Error loading profile</h2>
          <p className="mt-2 text-red-700">
            There was a problem loading your profile. Please try again later.
          </p>
        </div>
      </div>
    );
  }
  
  // Use either the freshly loaded profile data or the cached user state
  const userData = profileData || user;
  
  if (!userData) {
    return null;
  }
  
  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="p-8 bg-white rounded-lg shadow-lg profile-card">
        <div className="flex items-center justify-between mb-6 profile-section">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit Profile
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="profile-section">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Personal Information</h2>
            <div className="p-6 bg-gray-50 rounded-md">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg text-gray-800">{userData.firstName} {userData.lastName}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg text-gray-800">{userData.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <p className="text-lg text-gray-800">
                  {userData.role === 'CUSTOMER' ? 'Customer' : 
                   userData.role === 'VENDOR' ? 'Restaurant Owner' : 
                   userData.role === 'DELIVERY_AGENT' ? 'Delivery Agent' : 
                   userData.role === 'ADMIN' ? 'Administrator' : 'User'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Joined On</p>
                <p className="text-lg text-gray-800">
                  {new Date(userData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="profile-section">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Account Security</h2>
            <div className="p-6 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Password</p>
                  <p className="text-lg text-gray-800">••••••••</p>
                </div>
                <button className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Change
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Two-Factor Authentication</p>
                <p className="text-lg text-gray-800">Not enabled</p>
              </div>
              <button className="w-full px-4 py-2 mt-4 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 profile-section">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Preferences</h2>
          <div className="p-6 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates about your orders and promotions</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle-email" className="absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer toggle-checkbox" />
                <label htmlFor="toggle-email" className="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer toggle-label"></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive text messages for order status updates</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle-sms" className="absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer toggle-checkbox" />
                <label htmlFor="toggle-sms" className="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer toggle-label"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
