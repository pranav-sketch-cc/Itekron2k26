import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, MapPin, Users, Clock, ArrowLeft, ShieldAlert, CheckCircle, Ticket } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const EventDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);
  const [userRegistrationId, setUserRegistrationId] = useState<string | null>(null);

  const eventId = params?.id;

  useEffect(() => {
    if (eventId) {
      fetchEventDetail(eventId);
    }
  }, [eventId, user]);

  const fetchEventDetail = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

      let query = supabase.from('events').select('*');
      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }

      const { data, error: fetchError } = await query.maybeSingle();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data) {
        setError('Event details could not be found.');
        setLoading(false);
        return;
      }

      setEvent(data);

      if (user) {
        const { data: regData } = await supabase
          .from('registrations')
          .select('registration_id')
          .eq('event_id', data.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (regData) {
          setAlreadyRegistered(true);
          setUserRegistrationId(regData.registration_id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!event) return;
    if (!user) {
      setLocation('/login');
    } else {
      setLocation(`/events/${event.id}/register`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <LoadingSpinner message="Fetching event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-28 px-4 text-center">
        <div className="spider-card max-w-md mx-auto p-8 rounded-3xl space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Event Unavailable</h2>
          <p className="text-xs text-slate-300 leading-relaxed">{error || 'The requested event does not exist.'}</p>
          <Link href="/events" className="spider-button-secondary inline-block px-6 py-2.5 rounded-full text-xs font-bold">
            Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  const parsedTeamSize = Number(event.team_size) || 1;
  const isTeam = event.team_type === 'team' || parsedTeamSize > 1;

  // Safely parse rules_regulations regardless of database format (Array, String, or Null)
  const rulesList: string[] = (() => {
    const raw: any = event.rules_regulations;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {
        // Explicit string fallback parsing
      }
      return (raw as string).split(/\n|,/).map((r) => r.trim()).filter(Boolean);
    }
    return [];
  })();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back Link */}
      <Link href="/events" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Events</span>
      </Link>

      {/* Hero Banner */}
      <div className="spider-card p-6 sm:p-10 rounded-3xl space-y-8 border-red-900/40">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/50 px-3 py-1 rounded-full">
              {event.category}
            </span>
            <span className="text-[10px] text-slate-300 flex items-center space-x-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{isTeam ? `Team Event (${event.team_size} members)` : 'Individual Competition'}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {event.name}
          </h1>
        </div>

        {/* Schedule & Venue Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 text-xs">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-slate-500 uppercase font-bold text-[10px]">Date & Time</p>
              <p className="text-slate-200 font-semibold">{formatDate(event.date_time)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-slate-500 uppercase font-bold text-[10px]">Venue</p>
              <p className="text-slate-200 font-semibold">{event.venue || 'TBA'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-slate-500 uppercase font-bold text-[10px]">Deadline</p>
              <p className="text-slate-200 font-semibold">{formatDate(event.registration_deadline)}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">About the Event</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Rules & Regulations */}
        {rulesList.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Rules & Regulations</h2>
            <ul className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-900">
              {rulesList.map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button Section */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          {alreadyRegistered ? (
            <div className="w-full bg-emerald-950/50 border border-emerald-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-400">
              <div className="flex items-center space-x-2 text-xs font-bold">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>You are registered for this event!</span>
              </div>
              {userRegistrationId && (
                <Link
                  href={`/pass/${userRegistrationId}`}
                  className="spider-button-secondary inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                >
                  <Ticket className="w-4 h-4 text-red-400" />
                  <span>View Pass</span>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-400">
                {!user ? 'Login required to register.' : 'Click to register for this event.'}
              </div>
              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto spider-button-primary px-8 py-3 rounded-2xl text-xs font-bold disabled:opacity-50"
              >
                {user ? 'Register Now' : 'Login to Register'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;