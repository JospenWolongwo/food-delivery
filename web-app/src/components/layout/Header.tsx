import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { gsap } from 'gsap';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import CartButton from '../cart/CartButton';

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Header animation with GSAP
    const header = headerRef.current;
    if (header) {
      gsap.from(header, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Animate nav items separately for a staggered effect
      gsap.from('.nav-item', {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.3
      });
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header ref={headerRef} className="bg-white shadow-md py-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">Campus Foods</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-item text-base font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'} transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/meals" 
              className={`nav-item text-base font-medium ${isActive('/meals') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'} transition-colors`}
            >
              Meals
            </Link>
            <Link 
              to="/vendors" 
              className={`nav-item text-base font-medium ${isActive('/vendors') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'} transition-colors`}
            >
              Restaurants
            </Link>
            <Link 
              to="/subscriptions" 
              className={`nav-item text-base font-medium ${isActive('/subscriptions') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'} transition-colors`}
            >
              Meal Plans
            </Link>
          </nav>
          
          {/* Right Side - Cart and User Menu */}
          <div className="flex items-center space-x-6">
            {/* Cart Button Component */}
            <div className="nav-item">
              <CartButton />
            </div>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group nav-item">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    {user?.firstName ? user.firstName.charAt(0) : ''}
                    {user?.lastName ? user.lastName.charAt(0) : ''}
                  </div>
                  <span className="hidden md:inline-block">{user?.firstName} {user?.lastName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">
                    My Orders
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'VENDOR') && (
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">
                      Dashboard
                    </Link>
                  )}
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 nav-item">
                <Link 
                  to="/login" 
                  className="text-indigo-600 hover:text-indigo-800 transition-colors hidden md:inline-block"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="grid grid-cols-1 gap-4 py-2">
              <Link 
                to="/" 
                className={`text-base font-medium ${isActive('/') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
              >
                Home
              </Link>
              <Link 
                to="/meals" 
                className={`text-base font-medium ${isActive('/meals') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
              >
                Meals
              </Link>
              <Link 
                to="/vendors" 
                className={`text-base font-medium ${isActive('/vendors') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
              >
                Restaurants
              </Link>
              <Link 
                to="/subscriptions" 
                className={`text-base font-medium ${isActive('/subscriptions') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
              >
                Meal Plans
              </Link>
              {!isAuthenticated && (
                <Link 
                  to="/login" 
                  className={`text-base font-medium ${isActive('/login') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
                >
                  Login
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link 
                    to="/profile" 
                    className={`text-base font-medium ${isActive('/profile') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className={`text-base font-medium ${isActive('/orders') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
                  >
                    My Orders
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'VENDOR') && (
                    <Link 
                      to="/dashboard" 
                      className={`text-base font-medium ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-700'} hover:text-indigo-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-base font-medium text-red-600 hover:text-red-700 transition-colors px-2 py-1 rounded-md hover:bg-red-50 w-full"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );

export default Header;
