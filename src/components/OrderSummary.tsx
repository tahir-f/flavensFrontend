import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  placeOrder: () => Promise<void>;
  isProcessing: boolean;
}

const OrderSummary = ({ 
  items, 
  updateQuantity, 
  removeItem, 
  placeOrder,
  isProcessing 
}: OrderSummaryProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="card text-center py-8">
        <h3 className="text-xl font-bold mb-4">Your Order</h3>
        <p className="text-gray-500 mb-6">Your order is empty</p>
        <a href="/menu" className="btn btn-primary">
          Browse Menu
        </a>
      </div>
    );
  }

  return (
    <div className="card">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-bold">Order Summary</h3>
        <button className="p-1">
          {isOpen ? '−' : '+'}
        </button>
      </div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  
                  <span className="w-6 text-center">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 ml-2 text-error hover:bg-error/10 rounded-full transition-colors"
                    aria-label={`Remove ${item.name} from order`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={placeOrder}
            disabled={isProcessing}
            className="btn btn-primary w-full mt-6"
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default OrderSummary;