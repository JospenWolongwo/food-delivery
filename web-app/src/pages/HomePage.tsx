import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FeaturedMeals from '../components/meals/FeaturedMeals';
import Cart from '../components/cart/Cart';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Hero section animation
    const heroTl = gsap.timeline();
    if (heroRef.current) {
      heroTl.from(heroRef.current.querySelector('.hero-title'), {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from(heroRef.current.querySelector('.hero-description'), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .from(heroRef.current.querySelectorAll('.hero-button'), {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from(heroRef.current.querySelector('.hero-image'), {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.6');
    }

    // Features section animation
    if (featuresRef.current && featureRefs.current.length > 0) {
      gsap.from(featuresRef.current.querySelector('.section-title'), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      featureRefs.current.forEach((feature, index) => {
        if (feature) {
          gsap.from(feature, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: feature,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          });
        }
      });
    }

    // How it works section animation
    if (howItWorksRef.current && stepRefs.current.length > 0) {
      gsap.from(howItWorksRef.current.querySelector('.section-title'), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      stepRefs.current.forEach((step, index) => {
        if (step) {
          gsap.from(step, {
            x: index % 2 === 0 ? -30 : 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          });
        }
      });
    }
  }, []);

  // Add feature refs
  const addToFeatureRefs = (el: HTMLDivElement | null) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  };

  // Add step refs
  const addToStepRefs = (el: HTMLDivElement | null) => {
    if (el && !stepRefs.current.includes(el)) {
      stepRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div ref={heroRef} className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="container-custom flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
            <h1 className="hero-title text-4xl md:text-5xl font-bold mb-6">Campus Food Delivery Made Simple</h1>
            <p className="hero-description text-lg md:text-xl mb-8">Connect with local food vendors and enjoy subscription-based meal delivery service right on your campus.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/restaurants" className="hero-button btn-secondary bg-white text-indigo-600 hover:bg-gray-100">
                Explore Restaurants
              </Link>
              <Link to="/register" className="hero-button btn-primary bg-orange-500 hover:bg-orange-600">
                Sign Up Now
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img 
              src="/placeholder-hero.png" 
              alt="Campus Food Delivery" 
              className="hero-image rounded-lg shadow-xl max-w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold text-center mb-16">Why Choose Campus Foods?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div ref={addToFeatureRefs} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">30-Minute Delivery</h3>
              <p className="text-gray-600">Our guaranteed 30-minute delivery ensures your food arrives hot and fresh, right when you need it.</p>
            </div>

            <div ref={addToFeatureRefs} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Subscription Plans</h3>
              <p className="text-gray-600">Save money with our flexible subscription plans. Get your favorite meals at discounted prices.</p>
            </div>

            <div ref={addToFeatureRefs} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Vendors</h3>
              <p className="text-gray-600">Support local businesses while enjoying a diverse range of food options from trusted vendors.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="py-20">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="space-y-16">
            <div ref={addToStepRefs} className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-2xl font-semibold mb-4">Choose Your Meal Plan</h3>
                <p className="text-gray-600">Select from our variety of subscription plans that suit your needs and budget. From 5 meals a week to unlimited options, we've got you covered.</p>
              </div>
              <div className="md:w-1/2">
                <img src="/placeholder-step1.png" alt="Choose Your Meal Plan" className="rounded-lg shadow-lg max-w-full h-auto" />
              </div>
            </div>

            <div ref={addToStepRefs} className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-10">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-2xl font-semibold mb-4">Browse & Order</h3>
                <p className="text-gray-600">Explore restaurants and meals available near your campus. Place orders directly through our easy-to-use platform.</p>
              </div>
              <div className="md:w-1/2">
                <img src="/placeholder-step2.png" alt="Browse & Order" className="rounded-lg shadow-lg max-w-full h-auto" />
              </div>
            </div>

            <div ref={addToStepRefs} className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-2xl font-semibold mb-4">Track Your Delivery</h3>
                <p className="text-gray-600">Follow your order in real-time as it makes its way to your location. Get updates on preparation and delivery status.</p>
              </div>
              <div className="md:w-1/2">
                <img src="/placeholder-step3.png" alt="Track Your Delivery" className="rounded-lg shadow-lg max-w-full h-auto" />
              </div>
            </div>

            <div ref={addToStepRefs} className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-10">
                <div className="bg-indigo-100 text-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">4</div>
                <h3 className="text-2xl font-semibold mb-4">Enjoy & Repeat</h3>
                <p className="text-gray-600">Receive your meal and enjoy! Rate your experience and order again with just a few clicks.</p>
              </div>
              <div className="md:w-1/2">
                <img src="/placeholder-step4.png" alt="Enjoy & Repeat" className="rounded-lg shadow-lg max-w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* Featured Meals Section */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold text-center mb-12">Featured Meals</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover our most popular dishes from the best restaurants on campus
          </p>
          <FeaturedMeals />
          <div className="mt-12 text-center">
            <Link 
              to="/meals" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse All Meals
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students who have simplified their campus dining experience with our meal delivery service.</p>
          <Link to="/register" className="btn-secondary bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3">
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
