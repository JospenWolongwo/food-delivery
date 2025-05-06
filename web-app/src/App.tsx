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
    
    // Global animations that should run on first load
    const tl = gsap.timeline();
    tl.to('body', { duration: 0, css: { visibility: 'visible' } });
    
    return () => {
      // Clean up any global animations or listeners
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
