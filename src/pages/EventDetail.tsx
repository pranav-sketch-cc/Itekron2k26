import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const EventDetail: React.FC = () => {
  const [, params] = useRoute('/events/:id');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const eventId = params?.id;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const { data, error: fetchErr } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (fetchErr) throw fetchErr;
        setEvent(data);
      } catch (err: any) {
        console.error('Error fetching event details:', err);
        setError('Event not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleRegisterClick = () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      setLocation('/login');
      return;
    }

    if (eventId) {
      // Navigate to the standalone registration page route
      setLocation(`/events/${eventId}/register`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Event not found'}</h2>
        <button
          onClick={() => setLocation('/events')}
          className="spider-button-primary px-6 py-2 rounded-xl text-xs font-bold"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      <button
        onClick={() => setLocation('/events')}
        className="mb-6 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-2"
      >
        ← Back to Events
      </button>

      <div className="spider-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="text-xs font-mono px-3 py-1 bg-red-950/80 border border-red-800 text-red-400 rounded-full">
              {event.category || 'Technical'}
            </span>
            <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
          </div>

          <button
            onClick={handleRegisterClick}
            className="spider-button-primary px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Register Now
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 py-6 border-y border-slate-800/80 text-sm">
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Date & Time</p>
            <p className="font-semibold text-slate-200 mt-1">
              {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Venue</p>
            <p className="font-semibold text-slate-200 mt-1">{event.venue || 'Campus Auditorium'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Registration Fee</p>
            <p className="font-semibold text-red-400 mt-1">
              {String(event.id).toLowerCase().includes('convera') ? '₹150' : '₹50'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <h3 className="text-lg font-bold text-white">Event Overview</h3>
          <p>{event.description || 'No detailed description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;