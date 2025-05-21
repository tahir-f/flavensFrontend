import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { addDays, format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../services/appwrite';

const availableTimes = [
  '17:00', '17:30', '18:00', '18:30', '19:00', 
  '19:30', '20:00', '20:30', '21:00', '21:30'
];

const ReservationForm = () => {
  const { user, isAuthenticated } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to make a reservation');
      return;
    }
    
    if (!date || !time) {
      setError('Please select a date and time');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createReservation(
        user.$id,
        date,
        time,
        guests,
        notes
      );
      
      setSuccess(true);
      // Reset form
      setDate('');
      setTime('');
      setGuests(2);
      setNotes('');
    } catch (err) {
      setError('Failed to create reservation. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-serif font-bold mb-6">Make a Reservation</h2>
      
      {success ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-success text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-2">Reservation Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            We've received your reservation request. You'll receive a confirmation 
            email shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn btn-primary"
          >
            Make Another Reservation
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error/10 text-error p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="input"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <select
              id="time"
              className="input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">Select a time</option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              className="input"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              id="notes"
              className="input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or dietary requirements"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting || !isAuthenticated}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
          </button>
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-4">
              Please <a href="/login" className="text-primary hover:underline">login</a> to make a reservation.
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default ReservationForm;