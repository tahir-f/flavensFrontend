import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface MenuItem {
  $id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  tags: string[];
}

interface MenuCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuCard = ({ item, onAddToOrder }: MenuCardProps) => {
  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
        <img 
          src={item.image || "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
          alt={item.name}
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-2 left-2">
          {item.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-block bg-accent/90 text-white text-xs px-2 py-1 rounded-full mr-2 mb-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <h3 className="font-serif text-xl font-bold mb-2">{item.name}</h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
        
        <button 
          onClick={() => onAddToOrder(item)}
          disabled={!item.available}
          className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            item.available 
              ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          aria-label={`Add ${item.name} to order`}
        >
          <ShoppingCart size={16} />
          <span>{item.available ? 'Add to Order' : 'Unavailable'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MenuCard;