import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/appwrite';

const Profile = () => {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Sample food preferences and allergies
  const foodPreferenceOptions = [
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Keto',
    'Paleo',
    'Gluten-Free',
    'Dairy-Free',
    'Low-Carb',
    'Spicy'
  ];
  
  const allergyOptions = [
    'Peanuts',
    'Tree Nuts',
    'Milk',
    'Eggs',
    'Fish',
    'Shellfish',
    'Soy',
    'Wheat',
    'Gluten'
  ];
  
  const togglePreference = (preference: string) => {
    if (preferences.includes(preference)) {
      setPreferences(preferences.filter(p => p !== preference));
    } else {
      setPreferences([...preferences, preference]);
    }
  };
  
  const toggleAllergy = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter(a => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Create user context object
      const userContext = {
        preferences,
        allergies,
        favorite_items: []
      };
      
      // Update user profile
      await updateUserProfile(user.$id, {
        name,
        phone,
        user_context: JSON.stringify(userContext)
      });
      
      setSuccess(true);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-serif font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Profile
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Manage your account and preferences
          </motion.p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-error/10 text-error p-4 rounded-md mb-6 flex items-start space-x-2">
              <AlertCircle size={20} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-success/10 text-success p-4 rounded-md mb-6 flex items-start space-x-2">
              <span>Profile updated successfully!</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="name"
                    className="input pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="email"
                    className="input pl-10 bg-gray-50"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    id="phone"
                    className="input pl-10"
                    placeholder="+1 (123) 456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Dietary Preferences</h3>
              <p className="text-gray-600 text-sm mb-4">
                Select your dietary preferences to help us recommend dishes.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {foodPreferenceOptions.map((preference) => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => togglePreference(preference)}
                    className={`px-3 py-2 rounded-md text-sm ${
                      preferences.includes(preference)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">Food Allergies</h3>
              <p className="text-gray-600 text-sm mb-4">
                Help us keep you safe by letting us know about your allergies.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {allergyOptions.map((allergy) => (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-3 py-2 rounded-md text-sm ${
                      allergies.includes(allergy)
                        ? 'bg-error text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary min-w-32"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">Order History</h3>
            <p className="text-gray-600">
              You haven't placed any orders yet.
            </p>
            <a href="/menu" className="text-primary hover:underline mt-4 inline-block">
              Browse our menu
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">Your Reservations</h3>
            <p className="text-gray-600">
              You don't have any upcoming reservations.
            </p>
            <a href="/reservation" className="text-primary hover:underline mt-4 inline-block">
              Make a reservation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;