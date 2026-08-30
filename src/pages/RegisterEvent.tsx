import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RegisterEvent: React.FC = () => {
  const [match1, params1] = useRoute('/events/:eventId/register');
  const [match2, params2] = useRoute('/events/:id/register');
  const [, setLocation] = useLocation();

  const eventId = params1?.eventId || params2?.id;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (!error && data) {
          setEvent(data);
        }
      } catch (err) {
        console.error('Error fetching event for registration:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-24 text-center text-white">
        <p className="text-red-500 mb-4">Event not found.</p>
        <button onClick={() => setLocation('/events')} className="spider-button-primary px-4 py-2 text-xs font-bold rounded-xl">
          Back to Events
        </button>
      </div>
    );
  }

  const isConvera = String(event.id).toLowerCase().includes('convera');
  const displayPrice = isConvera ? '₹150' : '₹50';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-2xl mx-auto text-white">
      <button
        onClick={() => setLocation(`/events/${event.id}`)}
        className="mb-6 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2"
      >
        ← Back to Event Details
      </button>

      <div className="spider-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white mb-2">Register for {event.title}</h1>
        <p className="text-slate-400 text-xs mb-6">Registration Fee: <span className="text-red-400 font-bold">{displayPrice}</span></p>

        {/* Existing registration form elements continue here */}
      </div>
    </div>
  );
};

export default RegisterEvent;