import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, MapPin, Users, Clock, ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const EventDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);

  const eventId = params?.id;

  useEffect(() => {
    if (eventId) {
      fetchEventDetail(eventId);
    }
  }, [eventId, user]);

  const fetchEventDetail = async (id: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      setError('Event details could not be loaded.');
      setLoading(false);
      return;
    }

    setEvent(data);

    if (user) {
      const { data: regData } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (regData) {
        setAlreadyRegistered(true);
      }
    }

    setLoading(false);
  };

  const handleRegisterClick = () => {
    if (!user) {
      setLocation('/login');
    } else {
      setLocation(`/events/${eventId}/register`);
    }
  };

  if (loading) return <div className="min-h-screen pt-24"><LoadingSpinner message="Loading event specifications..." /></div>;

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <div className="spider-card max-w-md mx-auto p-8 rounded-2xl space-y-4">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-slate-300">{error || 'Event not found.'}</p>
          <Link href="/events" className="spider-button-secondary inline-block px-6 py-2 rounded-xl text-xs">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isTeam = event.team_type === 'team';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/events" className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Events</span>
      </Link>

      <div className="spider-card p-6 sm:p-8 rounded-3xl space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/50 px-3 py-1 rounded-full">
              {event.category}
            </span>
            <span className="text-xs text-slate-300 flex items-center space-x-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{isTeam ? `Team Event (${event.team_size} members)` : 'Individual Participation'}</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {event.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-slate-500 uppercase font-semibold text-[10px]">Date & Time</p>
              <p className="text-slate-200 font-medium">{formatDate(event.date_time)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-slate-500 uppercase font-semibold text-[10px]">Venue</p>
              <p className="text-slate-200 font-medium">{event.venue || 'TBA'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-slate-500 uppercase font-semibold text-[10px]">Deadline</p>
              <p className="text-slate-200 font-medium">{formatDate(event.registration_deadline)}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-2 uppercase tracking-wide">About the Event</h2>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {event.rules_regulations && event.rules_regulations.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-white mb-3 uppercase tracking-wide">Rules & Regulations</h2>
            <ul className="space-y-2">
              {event.rules_regulations.map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          {alreadyRegistered ? (
            <div className="w-full bg-emerald-950/60 border border-emerald-800/80 p-4 rounded-2xl flex items-center justify-between text-emerald-400">
              <div className="flex items-center space-x-2 text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>You are already registered for this event!</span>
              </div>
              <Link href="/my-registrations" className="spider-button-secondary px-4 py-2 rounded-xl text-xs">
                View Digital Pass
              </Link>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-400">
                {!user ? 'Log in required to complete registration.' : 'Click to proceed to registration form.'}
              </div>
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto spider-button-primary px-8 py-3 rounded-2xl text-sm font-bold shadow-lg transition"
              >
                {user ? 'Register for Event' : 'Login to Register'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};