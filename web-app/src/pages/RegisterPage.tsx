import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { gsap } from 'gsap';
import { useRegisterMutation, useGetOAuthUrlMutation, useSocialAuthMutation } from '../store/api/authApi';
import { setError, clearError } from '../store/slices/authSlice';
import { RootState } from '../store';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const formElementsRef = useRef<(HTMLElement | null)[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [register, { isLoading }] = useRegisterMutation();
  const [getOAuthUrl] = useGetOAuthUrlMutation();
  const [socialAuth] = useSocialAuthMutation();
  
  const { error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check for OAuth callback parameters on component mount
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const provider = params.get('provider');
      const error = params.get('error');
      
      // Clean URL from parameters
      if (params.toString()) {
        const cleanUrl = location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      
      if (error) {
        dispatch(setError(error));
        return;
      }
      
      if (token && provider && (provider === 'google' || provider === 'facebook')) {
        try {
          setSocialLoading(provider);
          await socialAuth({ token, provider });
          setSocialLoading(null);
        } catch (err: any) {
          dispatch(setError(err?.data?.message || `${provider} authentication failed`));
          setSocialLoading(null);
        }
      }
    };
    
    handleOAuthCallback();
  }, [location.search, dispatch, socialAuth]);
  
  // GSAP animations - modified to prevent style conflicts
  useEffect(() => {
    // Form animation - only animate opacity
    if (formRef.current && formElementsRef.current.length > 0) {
      gsap.fromTo(formRef.current, 
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 0.5, 
          ease: 'power2.out'
        }
      );
      
      // Staggered animation of form elements - only animate opacity
      gsap.fromTo(formElementsRef.current, 
        { opacity: 0 },
        { 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.4, 
          delay: 0.2, 
          ease: 'power2.out'
        }
      );
    }
  }, []);
  
  // Add element to formElementsRef
  const addToFormElementsRef = (el: HTMLElement | null) => {
    if (el && !formElementsRef.current.includes(el)) {
      formElementsRef.current.push(el);
    }
  };
  
  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      clearError();
      
      // Split the name into first name and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Call the register mutation from our authApi
      await register({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phoneNumber || undefined
      }).unwrap();
      
      // Navigation will happen automatically based on the isAuthenticated value
      // which is updated by the extraReducers in authSlice
      
    } catch (error: any) {
      setError(error?.data?.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
        <div className="w-full" ref={addToFormElementsRef}>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div ref={addToFormElementsRef} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Social Registration Options */}
          <div ref={addToFormElementsRef} className="w-full">
            <div className="flex flex-col space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={async () => {
                  try {
                    setSocialLoading('google');
                    const result = await getOAuthUrl({ provider: 'google', returnUrl: window.location.href }).unwrap();
                    window.location.href = result.url;
                  } catch (error: any) {
                    dispatch(setError(error?.data?.message || 'Failed to connect to Google'));
                    setSocialLoading(null);
                  }
                }}
                disabled={isLoading || socialLoading !== null}
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Continue with Google
              </button>
            
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2]"
                onClick={async () => {
                  try {
                    setSocialLoading('facebook');
                    const result = await getOAuthUrl({ provider: 'facebook', returnUrl: window.location.href }).unwrap();
                    window.location.href = result.url;
                  } catch (error: any) {
                    dispatch(setError(error?.data?.message || 'Failed to connect to Facebook'));
                    setSocialLoading(null);
                  }
                }}
                disabled={isLoading || socialLoading !== null}
              >
                <svg className="h-5 w-5 mr-2" fill="white" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.292h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                Continue with Facebook
              </button>
            </div>
            
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">or create an account</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          </div>
          
          <div className="rounded-md space-y-4">
            <div ref={addToFormElementsRef}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div ref={addToFormElementsRef}>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div ref={addToFormElementsRef}>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number (optional)</label>
              <input
                id="phone-number"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div ref={addToFormElementsRef}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div ref={addToFormElementsRef}>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div ref={addToFormElementsRef}>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
          
          <div ref={addToFormElementsRef} className="text-sm text-center text-gray-600">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
