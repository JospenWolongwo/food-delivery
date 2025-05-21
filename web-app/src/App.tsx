import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MealsPage from './pages/MealsPage';
import MealDetailPage from './pages/MealDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  // Initialize GSAP and any global animations
  useEffect(() => {
    // Register any GSAP plugins or global settings
    gsap.config({
      nullTargetWarn: false,
    });
    
    // Add a small delay to ensure React has fully rendered components before applying animations
    setTimeout(() => {
      // Prevent GSAP from interfering with Tailwind styles
      document.body.classList.add('gsap-loaded');
    }, 50);
    
    // Global animations that should run on first load - but don't animate visibility
    // or position properties which can conflict with Tailwind
    // Using an empty timeline to avoid conflicts
    const tl = gsap.timeline();
    
    return () => {
      // Clean up any global animations or listeners
      document.body.classList.remove('gsap-loaded');
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/meals/:id" element={<MealDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
