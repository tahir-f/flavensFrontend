import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Calendar, Clock, Menu, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if user is admin
  useEffect(() => {
    if (userRole !== 'admin') {
      // Redirect or show access denied
      console.log('Access denied - not an admin');
    }
  }, [userRole]);
  
  // Sample dashboard data
  const dashboardData = {
    totalOrders: 158,
    pendingOrders: 12,
    totalReservations: 47,
    totalCustomers: 239,
    recentOrders: [
      { id: 'ORD123', customer: 'John Doe', items: 3, total: 89.97, status: 'delivered' },
      { id: 'ORD124', customer: 'Jane Smith', items: 2, total: 45.98, status: 'preparing' },
      { id: 'ORD125', customer: 'Robert Johnson', items: 4, total: 112.96, status: 'pending' }
    ],
    recentReservations: [
      { id: 'RES123', customer: 'Emily Brown', date: '2025-06-10', time: '19:00', guests: 4, status: 'confirmed' },
      { id: 'RES124', customer: 'Michael Wilson', date: '2025-06-11', time: '20:30', guests: 2, status: 'pending' },
      { id: 'RES125', customer: 'Sarah Davis', date: '2025-06-12', time: '18:00', guests: 6, status: 'confirmed' }
    ]
  };
  
  // Admin access check
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-serif font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. 
              This area is restricted to administrators only.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <BarChart3 size={20} />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'orders' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <ShoppingBag size={20} />
                <span>Orders</span>
              </button>
              
              <button
                onClick={() => setActiveTab('reservations')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'reservations' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Calendar size={20} />
                <span>Reservations</span>
              </button>
              
              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'menu' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Menu size={20} />
                <span>Menu Items</span>
              </button>
              
              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'customers' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Users size={20} />
                <span>Customers</span>
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-serif font-bold mb-6">Dashboard Overview</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                        <h3 className="text-3xl font-bold">{dashboardData.totalOrders}</h3>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-full">
                        <ShoppingBag className="text-primary" size={24} />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-success">
                      <span className="font-medium">+12%</span> from last month
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Pending Orders</p>
                        <h3 className="text-3xl font-bold">{dashboardData.pendingOrders}</h3>
                      </div>
                      <div className="p-3 bg-warning/10 rounded-full">
                        <Clock className="text-warning" size={24} />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-warning">
                      <span className="font-medium">Requires attention</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Reservations</p>
                        <h3 className="text-3xl font-bold">{dashboardData.totalReservations}</h3>
                      </div>
                      <div className="p-3 bg-accent/10 rounded-full">
                        <Calendar className="text-accent" size={24} />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-success">
                      <span className="font-medium">+8%</span> from last month
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Customers</p>
                        <h3 className="text-3xl font-bold">{dashboardData.totalCustomers}</h3>
                      </div>
                      <div className="p-3 bg-secondary/10 rounded-full">
                        <Users className="text-secondary" size={24} />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-success">
                      <span className="font-medium">+15%</span> from last month
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold">Recent Orders</h3>
                      <button className="text-primary text-sm hover:underline">
                        View All
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">ID</th>
                            <th className="text-left py-3 px-2">Customer</th>
                            <th className="text-right py-3 px-2">Total</th>
                            <th className="text-right py-3 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recentOrders.map((order) => (
                            <tr key={order.id} className="border-b last:border-b-0">
                              <td className="py-3 px-2 text-sm font-medium">{order.id}</td>
                              <td className="py-3 px-2 text-sm">{order.customer}</td>
                              <td className="py-3 px-2 text-sm text-right">${order.total.toFixed(2)}</td>
                              <td className="py-3 px-2 text-right">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  order.status === 'delivered' ? 'bg-success/10 text-success' :
                                  order.status === 'preparing' ? 'bg-warning/10 text-warning' :
                                  'bg-gray-100'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold">Recent Reservations</h3>
                      <button className="text-primary text-sm hover:underline">
                        View All
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Customer</th>
                            <th className="text-left py-3 px-2">Date</th>
                            <th className="text-left py-3 px-2">Time</th>
                            <th className="text-right py-3 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recentReservations.map((reservation) => (
                            <tr key={reservation.id} className="border-b last:border-b-0">
                              <td className="py-3 px-2 text-sm font-medium">{reservation.customer}</td>
                              <td className="py-3 px-2 text-sm">{reservation.date}</td>
                              <td className="py-3 px-2 text-sm">{reservation.time}</td>
                              <td className="py-3 px-2 text-right">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  reservation.status === 'confirmed' ? 'bg-success/10 text-success' :
                                  'bg-warning/10 text-warning'
                                }`}>
                                  {reservation.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-serif font-bold mb-6">Orders Management</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-500">Order management interface would go here.</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'reservations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-serif font-bold mb-6">Reservations Management</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-500">Reservation management interface would go here.</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'menu' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-serif font-bold mb-6">Menu Management</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-500">Menu management interface would go here.</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'customers' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-serif font-bold mb-6">Customer Management</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-500">Customer management interface would go here.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;