import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import { getMenuItems } from '../services/appwrite';
import { useAuth } from '../context/AuthContext';

// Sample menu categories
const categories = [
  'All',
  'Appetizers',
  'Main Courses',
  'Seafood',
  'Vegetarian',
  'Desserts',
  'Beverages'
];

// Sample menu tags
const allTags = [
  'Spicy',
  'Vegan',
  'Gluten-Free',
  'Organic',
  'Chef\'s Special',
  'Seasonal'
];

const Menu = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [cart, setCart] = useState<any[]>([]);
  
  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        
        // Filter params
        const filters: any = {};
        if (selectedCategory !== 'All') {
          filters.category = selectedCategory;
        }
        
        if (maxPrice < 100) {
          filters.maxPrice = maxPrice;
        }
        
        if (selectedTags.length > 0) {
          filters.tags = selectedTags;
        }
        
        const response = await getMenuItems(filters);
        setMenuItems(response.documents);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to load menu items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, [selectedCategory, maxPrice, selectedTags]);
  
  // Filter menu items by search query
  const filteredItems = menuItems.filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle adding items to cart
  const handleAddToCart = (item: any) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/menu' } });
      return;
    }
    
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.$id === item.$id);
    
    if (existingItemIndex !== -1) {
      // Item already in cart, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add item to cart
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse selection of carefully crafted dishes 
            made with the freshest ingredients and culinary expertise.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search menu..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center space-x-2"
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedCategory === category
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$10</span>
                    <span>${maxPrice}</span>
                    <span>$100</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Dietary & Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Categories quick filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-error py-8">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">No menu items found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxPrice(100);
                setSelectedTags([]);
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => (
              <MenuCard
                key={item.$id}
                item={item}
                onAddToOrder={handleAddToCart}
              />
            ))}
          </div>
        )}
        
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-30">
            <button
              onClick={() => navigate('/order')}
              className="btn btn-primary flex items-center space-x-2 shadow-lg"
            >
              <span>View Order</span>
              <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;