import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RegisterEvent: React.FC<any> = ({ event: initialEvent, onClose }) => {
  const [match1, params1] = useRoute('/events/:eventId/register');
  const [match2, params2] = useRoute('/events/:id/register');
  const [, setLocation] = useLocation();

  const eventId = params1?.eventId || params2?.id;
  const [event, setEvent] = useState<any>(initialEvent || null);
  const [loading, setLoading] = useState(!initialEvent);

  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
      setLoading(false);
      return;
    }

    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
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
  }, [eventId, initialEvent]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (event?.id) {
      setLocation(`/events/${event.id}`);
    } else {
      setLocation('/events');
    }
  };

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
        <button
          onClick={() => setLocation('/events')}
          className="spider-button-primary px-4 py-2 text-xs font-bold rounded-xl"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const isConvera = event.id === 'CONVERA01';
  const displayPrice = isConvera ? '₹150' : '₹50';
  const isTeam = event.team_type?.toLowerCase() === 'team';

  return (
    <div className="spider-card p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{event.name}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Type: <span className="text-slate-200">{isTeam ? 'Team Event' : 'Individual'}</span> | Fee: <span className="text-red-400 font-bold">{displayPrice}</span>
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1 bg-slate-800 rounded-lg"
        >
          ✕ Close
        </button>
      </div>

      <div className="space-y-4 text-xs text-slate-300">
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default RegisterEvent;