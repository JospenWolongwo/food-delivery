import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeaturedMeals from "../components/meals/FeaturedMeals";
import Cart from "../components/cart/Cart";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Hero carousel data
const heroSlides = [
  {
    id: 1,
    image: "/images/hero-image.jpg",
    title: "Campus Food Delivery Made Simple",
    description:
      "Connect with local food vendors and enjoy subscription-based meal delivery service right on your campus.",
    promotion: "Free delivery on your first order!",
  },
  {
    id: 2,
    image: "/images/hero-image2.jpg",
    title: "Fresh, Delicious Meals On Demand",
    description:
      "From local favorites to international cuisine, get the food you love delivered to your campus location.",
    promotion: "New vendors added weekly!",
  },
  {
    id: 3,
    image: "/images/hero-image3.jpg",
    title: "Flexible Meal Plans For Students",
    description:
      "Subscribe to a meal plan that fits your schedule and budget. No more waiting in cafeteria lines.",
    promotion: "15% off for new student subscribers!",
  },
];

const HomePage = () => {
  // Refs for section elements
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Simple carousel state
  const [activeSlide, setActiveSlide] = useState(0);
  const slideInterval = useRef<number | null>(null);

  // Handle slide navigation
  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    // Function to advance to next slide
    const advanceSlide = () => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    };

    // Clear any existing interval
    if (slideInterval.current) {
      window.clearInterval(slideInterval.current);
    }

    // Set up new interval with 8 second delay
    slideInterval.current = window.setInterval(advanceSlide, 8000);

    // Clean up interval on unmount
    return () => {
      if (slideInterval.current) {
        window.clearInterval(slideInterval.current);
        slideInterval.current = null;
      }
    };
  }, []);

  // Initialize animations - only runs once on mount
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Function to animate hero elements
    const animateHeroElements = () => {
      if (!heroRef.current) return;

      // Animate the hero section elements with a staggered effect
      const promotionBanner =
        heroRef.current.querySelector(".promotion-banner");
      const heroTitle = heroRef.current.querySelector(".hero-title");
      const heroDesc = heroRef.current.querySelector(".hero-description");
      const heroButtons = heroRef.current.querySelectorAll(".hero-button");
      const controls = heroRef.current.querySelectorAll(".carousel-control");

      // Create a timeline for smoother animations
      const tl = gsap.timeline();

      if (promotionBanner) {
        tl.fromTo(
          promotionBanner,
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "bounce.out" },
          0
        );
      }

      if (heroTitle) {
        tl.fromTo(
          heroTitle,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.3
        );
      }

      if (heroDesc) {
        tl.fromTo(
          heroDesc,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.5
        );
      }

      if (heroButtons.length) {
        tl.fromTo(
          heroButtons,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
          0.7
        );
      }

      if (controls.length) {
        tl.fromTo(
          controls,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
          0.9
        );
      }
    };

    // Features section animation
    const setupFeaturesAnimation = () => {
      if (!featuresRef.current) return;

      const sectionTitle = featuresRef.current.querySelector(".section-title");
      const features = featuresRef.current.querySelectorAll(".feature-item");

      if (sectionTitle) {
        gsap.fromTo(
          sectionTitle,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      features.forEach((feature, index) => {
        gsap.fromTo(
          feature,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: feature,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    };

    // How it works section animation
    const setupHowItWorksAnimation = () => {
      if (!howItWorksRef.current) return;

      const sectionTitle =
        howItWorksRef.current.querySelector(".section-title");
      const steps = howItWorksRef.current.querySelectorAll(".step-item");

      // Animate section title
      if (sectionTitle) {
        gsap.fromTo(
          sectionTitle,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: howItWorksRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate steps
      steps.forEach((step, index) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    };

    // Run all animations
    animateHeroElements();
    setupFeaturesAnimation();
    setupHowItWorksAnimation();

    // Cleanup function
    return () => {
      // Clear all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <div
        ref={heroRef}
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 relative overflow-hidden"
      >
        {/* Promotion Banner */}
        <div className="promotion-banner absolute top-0 left-0 right-0 bg-primary-800 py-2 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <span className="animate-pulse bg-yellow-500 text-black font-bold py-1 px-3 rounded-full mr-3 text-sm">
              NEW
            </span>
            <p className="text-white font-medium">
              {heroSlides[activeSlide].promotion}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-6">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-lg shadow-2xl h-[550px] md:h-[500px]">
            {/* Slides container */}
            <div className="h-full">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center p-6 lg:p-10 transition-all duration-500 ease-in-out ${
                    index === activeSlide
                      ? "opacity-100 translate-x-0 z-10"
                      : "opacity-0 translate-x-full z-0"
                  }`}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

                  {/* Content */}
                  <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0 z-10 relative">
                    <h1 className="hero-title text-4xl md:text-5xl font-bold mb-6 text-white">
                      {slide.title}
                    </h1>
                    <p className="hero-description text-lg md:text-xl mb-8 text-white">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/restaurants"
                        className="hero-button btn-secondary bg-white text-primary-600 hover:bg-gray-100 py-3 px-6 rounded-md font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        Explore Restaurants
                      </Link>
                      <Link
                        to="/register"
                        className="hero-button btn-primary bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-md font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        Sign Up Now
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="lg:w-1/2 flex justify-center z-10 relative">
                    <img
                      src={slide.image}
                      alt={`Slide ${slide.id}`}
                      className="hero-image rounded-lg shadow-xl max-w-full h-auto"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="carousel-control absolute left-4 top-1/2 transform -translate-y-1/2 bg-secondary-100/80 hover:bg-secondary-200 text-primary-600 p-2 rounded-full z-20 focus:outline-none transition-all duration-300"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="carousel-control absolute right-4 top-1/2 transform -translate-y-1/2 bg-secondary-100/80 hover:bg-secondary-200 text-primary-600 p-2 rounded-full z-20 focus:outline-none transition-all duration-300"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "bg-secondary-500 scale-125"
                      : "bg-secondary-300/50 hover:bg-secondary-400/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-3xl font-bold text-center mb-16">
            Why Choose Food Delivery?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-secondary-50 p-8 rounded-lg shadow-md text-center feature-item">
              <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-secondary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">30-Minute Delivery</h3>
              <p className="text-gray-600">
                Our guaranteed 30-minute delivery ensures your food arrives hot
                and fresh, right when you need it.
              </p>
            </div>

            <div className="bg-secondary-50 p-8 rounded-lg shadow-md text-center feature-item">
              <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-secondary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Subscription Plans</h3>
              <p className="text-gray-600">
                Save money with our flexible subscription plans. Get your
                favorite meals at discounted prices.
              </p>
            </div>

            <div className="bg-secondary-50 p-8 rounded-lg shadow-md text-center feature-item">
              <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-secondary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Vendors</h3>
              <p className="text-gray-600">
                Support local businesses while enjoying a diverse range of food
                options from trusted vendors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Meals Section */}
      <FeaturedMeals />

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-3xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="space-y-16">
            <div className="flex flex-col md:flex-row items-center step-item">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <div className="bg-secondary-100 text-secondary-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Choose Your Meal Plan
                </h3>
                <p className="text-gray-600">
                  Select from our variety of subscription plans that suit your
                  needs and budget. From 5 meals a week to unlimited options,
                  we've got you covered.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/meal-plan-selection.svg"
                  alt="Choose Your Meal Plan"
                  width="300"
                  height="300"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center step-item">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-10">
                <div className="bg-secondary-100 text-secondary-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-4">Browse & Order</h3>
                <p className="text-gray-600">
                  Explore restaurants and meals available near your campus.
                  Place orders directly through our easy-to-use platform.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/browse-order.svg"
                  alt="Browse & Order"
                  width="300"
                  height="300"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center step-item">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <div className="bg-secondary-100 text-secondary-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Track Your Delivery
                </h3>
                <p className="text-gray-600">
                  Follow your order in real-time as it makes its way to your
                  location. Get updates on preparation and delivery status.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/receive-delivery.svg"
                  alt="Receive Your Delivery"
                  width="300"
                  height="300"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center step-item">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-10">
                <div className="bg-secondary-100 text-secondary-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold mb-4">Enjoy & Repeat</h3>
                <p className="text-gray-600">
                  Receive your meal and enjoy! Rate your experience and order
                  again with just a few clicks.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/enjoy-repeat.svg"
                  alt="Enjoy & Repeat"
                  width="300"
                  height="300"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have simplified their campus dining
            experience with our meal delivery service.
          </p>
          <Link
            to="/register"
            className="bg-secondary-100 hover:bg-secondary-200 text-primary-700 font-bold py-3 px-8 rounded transition-colors duration-200 text-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Cart Component */}
      <Cart />
    </div>
  );
};

export default HomePage;
