import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MealList from '../components/meals/MealList';
import Cart from '../components/cart/Cart';
import gsap from 'gsap';

const MealsPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [vendorId, setVendorId] = useState<number | undefined>();
  
  // Extract query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const vendorParam = params.get('vendor');
    const searchParam = params.get('search');
    
    if (categoryParam) setCategory(categoryParam);
    if (vendorParam) setVendorId(parseInt(vendorParam));
    if (searchParam) setSearchQuery(searchParam);
  }, [location]);
  
  // Page animations
  useEffect(() => {
    const timeline = gsap.timeline();
    
    timeline
      .fromTo('.page-title', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('.search-container', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo('.categories-container', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');
  }, []);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Meals' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'gluten-free', name: 'Gluten Free' },
  ];
  
  const handleCategoryChange = (newCategory: string | undefined) => {
    setCategory(newCategory === 'all' ? undefined : newCategory);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You could update the URL here if you want to make the search sharable
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 page-title">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Meals` : 'Browse All Meals'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover delicious meals from our partner restaurants
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8 search-container">
          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for meals..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Categories */}
        <div className="mb-8 categories-container">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id === 'all' ? undefined : cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${cat.id === 'all' && !category || cat.id === category ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Meal List */}
        <MealList 
          vendorId={vendorId}
          category={category}
          searchTerm={searchQuery}
        />
      </div>
      
      {/* Cart Component */}
      <Cart />
    </div>
  );
};

export default MealsPage;
