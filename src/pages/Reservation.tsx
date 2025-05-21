import { motion } from 'framer-motion';
import ReservationForm from '../components/ReservationForm';

const Reservation = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-serif font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Reserve Your Table
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Secure your dining experience at Flavens. Whether it's a special 
            occasion or a casual dinner, we're ready to serve you.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Restaurant interior" 
                className="rounded-lg shadow-lg w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-lg"></div>
            </div>
            
            <div className="mt-8 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Hours of Operation</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="font-medium">Monday - Thursday</span>
                    <span>11:00 AM - 10:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Friday - Saturday</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium">Sunday</span>
                    <span>10:00 AM - 9:00 PM</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <p className="mb-2">
                  <span className="font-medium">Phone:</span> (123) 456-7890
                </p>
                <p className="mb-2">
                  <span className="font-medium">Email:</span> reservations@flavens.com
                </p>
                <p>
                  <span className="font-medium">Address:</span> 123 Culinary Avenue, Foodtown, FT 12345
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ReservationForm />
          </motion.div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-6 text-center">Reservation Policies</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Reservation Guidelines</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Reservations can be made up to 30 days in advance</li>
                  <li>For parties of 8 or more, please call us directly</li>
                  <li>We hold reservations for 15 minutes past the reserved time</li>
                  <li>Special requests are accommodated based on availability</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Cancellation Policy</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Cancellations should be made at least 24 hours in advance</li>
                  <li>Late cancellations may incur a fee</li>
                  <li>No-shows are recorded and may affect future reservations</li>
                  <li>To cancel, use your account or call us directly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;