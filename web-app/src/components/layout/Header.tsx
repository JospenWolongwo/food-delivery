import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { gsap } from "gsap";
import { logout } from "../../store/slices/authSlice";
import { RootState } from "../../store";
import CartButton from "../cart/CartButton";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Header animation with GSAP
    const header = headerRef.current;
    if (header) {
      // Use a safer animation approach that doesn't interfere with styles
      gsap.fromTo(
        header,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Target more specific elements and don't animate position properties
      // which can conflict with layout styles
      const navLinks = header.querySelectorAll("a, button");
      if (navLinks.length > 0) {
        gsap.fromTo(
          navLinks,
          { opacity: 0 },
          { opacity: 1, stagger: 0.05, duration: 0.3, delay: 0.2 }
        );
      }
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      ref={headerRef}
      className="bg-secondary-800 shadow-lg py-4 sticky top-0 z-30 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/images/logo.png"
              alt="Food Delivery Logo"
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold text-primary-600">
              Food Delivery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-item text-base font-medium ${
                isActive("/")
                  ? "text-white font-semibold"
                  : "text-gray-200 hover:text-white"
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/meals"
              className={`nav-item text-base font-medium ${
                isActive("/meals")
                  ? "text-white font-semibold"
                  : "text-gray-200 hover:text-white"
              } transition-colors`}
            >
              Meals
            </Link>
            <Link
              to="/vendors"
              className={`nav-item text-base font-medium ${
                isActive("/vendors")
                  ? "text-white font-semibold"
                  : "text-gray-200 hover:text-white"
              } transition-colors`}
            >
              Restaurants
            </Link>
            <Link
              to="/subscriptions"
              className={`nav-item text-base font-medium ${
                isActive("/subscriptions")
                  ? "text-white font-semibold"
                  : "text-gray-200 hover:text-white"
              } transition-colors`}
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
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-800 font-medium">
                    {user?.firstName ? user.firstName.charAt(0) : ""}
                    {user?.lastName ? user.lastName.charAt(0) : ""}
                  </div>
                  <span className="hidden md:inline-block text-gray-400 hover:text-white transition-colors">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-secondary-800 rounded-md shadow-lg py-1 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-white hover:bg-primary-600 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-sm text-white hover:bg-primary-600 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span>My Orders</span>
                  </Link>
                  {(user?.role === "ADMIN" || user?.role === "VENDOR") && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 text-sm text-white hover:bg-primary-600 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <hr className="my-1 border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 nav-item">
                <Link
                  to="/login"
                  className="text-gray-100 hover:text-white transition-colors hidden md:inline-block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:text-primary-700 transition-colors text-sm font-medium`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-secondary-700">
            <nav className="grid grid-cols-1 gap-4 py-2">
              <Link
                to="/"
                className={`text-base font-medium ${
                  isActive("/")
                    ? "text-white font-semibold"
                    : "text-gray-100 hover:text-white"
                } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
              >
                Home
              </Link>
              <Link
                to="/meals"
                className={`text-base font-medium ${
                  isActive("/meals")
                    ? "text-white font-semibold"
                    : "text-gray-100 hover:text-white"
                } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
              >
                Meals
              </Link>
              <Link
                to="/vendors"
                className={`text-base font-medium ${
                  isActive("/vendors")
                    ? "text-white font-semibold"
                    : "text-gray-100 hover:text-white"
                } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
              >
                Restaurants
              </Link>
              <Link
                to="/subscriptions"
                className={`text-base font-medium ${
                  isActive("/subscriptions")
                    ? "text-white font-semibold"
                    : "text-gray-100 hover:text-white"
                } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
              >
                Meal Plans
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className={`text-base font-medium ${
                    isActive("/login")
                      ? "text-white font-semibold"
                      : "text-gray-300"
                  } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
                >
                  Login
                </Link>
              )}
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    className={`text-base font-medium ${
                      isActive("/profile")
                        ? "text-white font-semibold"
                        : "text-gray-300"
                    } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className={`text-base font-medium ${
                      isActive("/orders")
                        ? "text-white font-semibold"
                        : "text-gray-300"
                    } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
                  >
                    My Orders
                  </Link>
                  {(user?.role === "ADMIN" || user?.role === "VENDOR") && (
                    <Link
                      to="/dashboard"
                      className={`text-base font-medium ${
                        isActive("/dashboard")
                          ? "text-white font-semibold"
                          : "text-gray-300"
                      } hover:bg-secondary-700 hover:text-white transition-colors px-4 py-2 rounded-md`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-base font-medium text-red-200 hover:bg-red-700 hover:text-white transition-colors px-4 py-2 rounded-md w-full"
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
};

export default Header;
