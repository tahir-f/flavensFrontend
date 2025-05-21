import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import OrderSummary from '../components/OrderSummary';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/appwrite';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const Order = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Simulated cart items for demo
  useEffect(() => {
    // In a real application, this would be retrieved from a context or localStorage
    const demoItems = [
      {
        id: '1',
        name: 'Truffle Pasta',
        price: 24.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        id: '2',
        name: 'Seared Salmon',
        price: 29.99,
        quantity: 2,
        image: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ];
    
    setCartItems(demoItems);
  }, []);
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setError('Please login to place an order');
      return;
    }
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create order in Appwrite
      const newOrder = await createOrder(
        user.$id,
        cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total
      );
      
      // Set order success and ID
      setOrderSuccess(true);
      setOrderId(newOrder.$id);
      
      // Clear cart
      setCartItems([]);
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">Your Order</h1>
            <p className="text-gray-600 mb-6">
              Please log in to view your order and checkout.
            </p>
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-success" size={32} />
            </div>
            
            <h1 className="text-3xl font-serif font-bold mb-4">Order Confirmed!</h1>
            
            <p className="text-gray-600 mb-2">
              Your order has been placed successfully.
            </p>
            
            <p className="text-gray-600 mb-6">
              Order ID: <span className="font-medium">{orderId}</span>
            </p>
            
            <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg mb-8">
              <h3 className="font-medium mb-4">What's Next?</h3>
              <ol className="text-left space-y-3">
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <span>Our kitchen team is preparing your order</span>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <span>You'll receive an email notification when your order is ready</span>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <span>Pick up your order at the restaurant or wait for delivery</span>
                </li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/menu" className="btn btn-primary">
                Return to Menu
              </Link>
              
              <Link to="/" className="btn btn-outline">
                Go to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Your Order</h1>
          <p className="text-gray-600">
            Review your items and proceed to checkout.
          </p>
        </div>
        
        {error && (
          <div className="bg-error/10 text-error p-4 rounded-md mb-6 flex items-start space-x-2 max-w-md mx-auto">
            <AlertCircle size={20} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-6">
                  Add some delicious items from our menu to get started.
                </p>
                <Link to="/menu" className="btn btn-primary">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b">Order Details</h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded text-gray-700"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-sm text-gray-500 hover:text-error"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Link to="/menu" className="text-primary hover:underline flex items-center">
                    ← Back to Menu
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <OrderSummary
              items={cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
              }))}
              updateQuantity={handleUpdateQuantity}
              removeItem={handleRemoveItem}
              placeOrder={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;