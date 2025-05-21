import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, AlertCircle } from 'lucide-react';
import { login as loginService, getCurrentUser } from '../services/appwrite';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get the redirect path if available
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Login with Appwrite
      await loginService(email, password);
      
      // Get user data
      const userData = await getCurrentUser();
      
      if (userData) {
        // Update auth context
        login(userData);
        
        // Redirect
        navigate(from, { replace: true });
      } else {
        setError('Failed to get user data after login');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.message.includes('Invalid credentials')) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-md">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">
              Log in to your account to continue your culinary journey.
            </p>
          </div>
          
          {error && (
            <div className="bg-error/10 text-error p-4 rounded-md mb-6 flex items-start space-x-2">
              <AlertCircle size={20} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  className="input pl-10"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  id="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
          
          {/* Test account */}
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2 font-medium">Test Account:</p>
            <p className="text-sm text-gray-600">Email: admin@flavens.com</p>
            <p className="text-sm text-gray-600">Password: password123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;