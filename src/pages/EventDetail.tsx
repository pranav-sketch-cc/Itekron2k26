import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RegisterEvent from './RegisterEvent';

export const EventDetail: React.FC = () => {
  const [, params] = useRoute('/events/:id');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const eventId = params?.id;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      setError('Invalid event link.');
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchErr } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (fetchErr || !data) {
          console.error('Supabase query error:', fetchErr);
          throw new Error('Event not found');
        }

        setEvent(data);
      } catch (err: any) {
        console.error('Error loading event:', err);
        setError('Event not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegisterClick = () => {
    if (!user) {
      setLocation('/login');
      return;
    }
    setIsRegisterModalOpen(true);
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
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Event not found.'}</h2>
        <button
          onClick={() => setLocation('/events')}
          className="spider-button-primary px-6 py-2 rounded-xl text-xs font-bold"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const isConvera = event.id === 'CONVERA01';
  const displayPrice = isConvera ? '₹150' : '₹50';

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
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 bg-red-950/80 border border-red-800 text-red-400 rounded-full">
                {event.category || 'Technical'}
              </span>
              <span className="text-xs font-mono px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full">
                {event.type || 'Event'}
              </span>
            </div>
            <h1 className="text-3xl font-bold mt-3">{event.name}</h1>
          </div>

          <button
            onClick={handleRegisterClick}
            className="spider-button-primary px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Register Now
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 my-8 py-6 border-y border-slate-800/80 text-sm">
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Date & Time</p>
            <p className="font-semibold text-slate-200 mt-1">{event.date_time || 'TBA'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Venue</p>
            <p className="font-semibold text-slate-200 mt-1">{event.venue || 'Campus'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Team Type</p>
            <p className="font-semibold text-slate-200 mt-1">{event.team_type || 'Individual'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Team Size</p>
            <p className="font-semibold text-slate-200 mt-1">{event.team_size || 'Individual Participation'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-mono">Registration Fee</p>
            <p className="font-semibold text-red-400 mt-1">{displayPrice}</p>
          </div>
        </div>

        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Event Overview</h3>
            <p>{event.description || 'No detailed description available.'}</p>
          </div>

          {event.rules_regulations && (
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Rules & Guidelines</h3>
              <p className="whitespace-pre-line text-slate-400">{event.rules_regulations}</p>
            </div>
          )}
        </div>
      </div>

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <div className="relative max-w-2xl mx-auto">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-bold z-10"
            >
              ✕ Close
            </button>
            <RegisterEvent event={event} onClose={() => setIsRegisterModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;