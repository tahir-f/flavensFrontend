import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, userRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  const navbarClass = isScrolled || location.pathname !== '/' 
    ? 'bg-white shadow-md' 
    : 'bg-transparent';

  const textColor = isScrolled || location.pathname !== '/' 
    ? 'text-text' 
    : 'text-white';

  const navLinkClass = `font-medium ${textColor} hover:text-primary transition-colors`;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarClass}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <Utensils 
              className={`w-8 h-8 ${textColor}`} 
              strokeWidth={1.5} 
            />
            <span className={`text-2xl font-serif font-bold ${textColor}`}>
              Flavens
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass}>Home</Link>
            <Link to="/menu" className={navLinkClass}>Menu</Link>
            <Link to="/reservation" className={navLinkClass}>Reservations</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/order" className={navLinkClass}>Order</Link>
                {userRole === 'admin' && (
                  <Link to="/dashboard" className={navLinkClass}>Dashboard</Link>
                )}
                <div className="flex space-x-4">
                  <Link to="/profile" className={`btn btn-outline border-primary ${textColor}`}>
                    Profile
                  </Link>
                  <button 
                    onClick={() => logout()} 
                    className="btn btn-primary"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className={`btn btn-outline border-primary ${textColor}`}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${textColor}`} />
            ) : (
              <Menu className={`w-6 h-6 ${textColor}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white mt-4 rounded-lg shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col p-4 space-y-4">
              <Link to="/" className="text-text hover:text-primary py-2">Home</Link>
              <Link to="/menu" className="text-text hover:text-primary py-2">Menu</Link>
              <Link to="/reservation" className="text-text hover:text-primary py-2">Reservations</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/order" className="text-text hover:text-primary py-2">Order</Link>
                  {userRole === 'admin' && (
                    <Link to="/dashboard" className="text-text hover:text-primary py-2">Dashboard</Link>
                  )}
                  <Link to="/profile" className="text-text hover:text-primary py-2">Profile</Link>
                  <button 
                    onClick={() => logout()} 
                    className="btn btn-primary w-full mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-text hover:text-primary py-2">Login</Link>
                  <Link to="/signup" className="btn btn-primary w-full mt-2">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;