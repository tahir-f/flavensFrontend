import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Flavens</h3>
            <p className="mb-4 text-gray-300">
              Experience culinary excellence with our chef-crafted dishes 
              in an elegant atmosphere. Perfect for special occasions or
              a delightful evening out.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-white transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="text-gray-300 hover:text-white transition-colors">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-primary-light" />
                <span className="text-gray-300">123 Culinary Avenue, Foodtown, FT 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-light" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-light" />
                <span className="text-gray-300">info@flavens.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Hours</h4>
              <p className="text-gray-300">Monday - Friday: 11am - 10pm</p>
              <p className="text-gray-300">Saturday - Sunday: 10am - 11pm</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Flavens Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;