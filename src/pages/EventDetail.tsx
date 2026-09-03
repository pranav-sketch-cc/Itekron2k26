import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RegisterEvent from './RegisterEvent';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';

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
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="spider-card max-w-md w-full rounded-3xl border border-red-900/50 bg-slate-950/70 p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/50 border border-red-900/50">
            <Sparkles className="h-6 w-6 text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Event Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">{error || 'The requested event could not be found.'}</p>
          <button
            onClick={() => setLocation('/events')}
            className="spider-button-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const normalizedCategory = String(event.category || '').trim().toLowerCase();
  const isTechnical = normalizedCategory === 'technical';
  const isConvera = String(event.id || '').toUpperCase() === 'CONVERA01';
  const displayPrice = isConvera ? '₹150' : isTechnical ? '₹50' : 'FREE';
  const eventType = event.event_type || event.type || event.team_type || 'Individual';
  const teamSize = event.max_team_size || event.team_size || 'Individual Participation';

  const accentClasses = isTechnical
    ? {
        badge: 'bg-red-950/70 border-red-900/60 text-red-400',
        glow: 'bg-red-500/15',
        line: 'via-red-500',
        button: 'bg-red-600 hover:bg-red-500 shadow-red-950/30',
        text: 'text-red-400',
        border: 'border-red-900/40',
      }
    : {
        badge: 'bg-blue-950/70 border-blue-900/60 text-blue-400',
        glow: 'bg-blue-500/15',
        line: 'via-blue-500',
        button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-950/30',
        text: 'text-blue-400',
        border: 'border-blue-900/40',
      };

  // Normalize literal escaped newlines from database content into real line breaks.
  const formattedRules = String(event.rules_regulations || '').replace(/\\n/g, '\n');

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute left-[4%] top-28 h-80 w-80 rounded-full blur-3xl animate-pulse ${accentClasses.glow}`} />
        <div className="absolute right-[4%] top-[45%] h-96 w-96 rounded-full bg-blue-600/10 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      {/* Back */}
      <button
        onClick={() => setLocation('/events')}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-950/70 group-hover:border-slate-600 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        </span>
        Back to Events
      </button>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${accentClasses.glow}`} />
        <div className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent ${accentClasses.line} to-transparent`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${accentClasses.badge}`}>
                <Sparkles className="w-3 h-3" />
                {event.category || 'Event'}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {event.type || 'Event'}
              </span>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 mb-3">ITEKRON 2K26</p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                {event.name}
              </h1>
            </div>

            <p className="max-w-3xl text-sm sm:text-base leading-7 text-slate-400">
              {event.description || 'Step into the arena and take on the challenge.'}
            </p>
          </div>

          <button
            onClick={handleRegisterClick}
            className={`group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-7 py-4 text-sm font-black transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${accentClasses.button}`}
          >
            Register Now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Event facts */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {[
          { label: 'Date', value: event.date_time || 'TBA', icon: Calendar },
          { label: 'Venue', value: event.venue || 'Campus', icon: MapPin },
          { label: 'Participation', value: eventType, icon: Users },
          { label: 'Entry Fee', value: displayPrice, icon: CheckCircle2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/65 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700">
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${accentClasses.glow}`} />
              <div className="relative z-10 flex items-start gap-3">
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accentClasses.border} bg-slate-900/80`}>
                  <Icon className={`h-4 w-4 ${accentClasses.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">{item.label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-200 break-words">{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Team size */}
      <section className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-950/65 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Team Format</p>
            <h2 className="mt-1 text-lg font-black text-white">Participation & Team Size</h2>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold ${accentClasses.badge}`}>
            <Users className="w-3.5 h-3.5" />
            {teamSize}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-5 mt-5">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/65 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-10 w-1 rounded-full ${isTechnical ? 'bg-red-500' : 'bg-blue-500'}`} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Challenge Brief</p>
              <h2 className="text-2xl font-black text-white">Event Overview</h2>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-400 whitespace-pre-line">
            {event.description || 'No detailed description available.'}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/65 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accentClasses.border} bg-slate-900/80`}>
              <Clock3 className={`w-4 h-4 ${accentClasses.text}`} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Event Schedule</p>
              <h2 className="text-xl font-black text-white">When & Where</h2>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-slate-600">Date & Time</p>
              <p className="mt-1 font-bold text-slate-200">{event.date_time || 'TBA'}</p>
            </div>
            <div className="h-px bg-slate-800/80" />
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-slate-600">Venue</p>
              <p className="mt-1 font-bold text-slate-200">{event.venue || 'Campus'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      {event.rules_regulations && (
        <section className="relative overflow-hidden mt-5 rounded-3xl border border-slate-800/80 bg-slate-950/65 p-6 sm:p-8">
          <div className={`absolute -right-16 -bottom-16 h-48 w-48 rounded-full blur-3xl ${accentClasses.glow}`} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-xl border ${accentClasses.border} bg-slate-900/80 flex items-center justify-center`}>
                <CheckCircle2 className={`w-4 h-4 ${accentClasses.text}`} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Before You Enter</p>
                <h2 className="text-2xl font-black text-white">Rules & Guidelines</h2>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6 text-sm leading-7 text-slate-400 whitespace-pre-line">
              {formattedRules}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="relative overflow-hidden mt-5 rounded-3xl border border-slate-800/80 bg-slate-950/70 p-7 sm:p-9 text-center">
        <div className={`absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full blur-3xl ${accentClasses.glow}`} />
        <div className="relative z-10">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600">Ready?</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white">Take your place in the arena.</h2>
          <p className="mt-2 text-sm text-slate-500">Register now and get ready for ITEKRON 2K26.</p>
          <button
            onClick={handleRegisterClick}
            className={`group mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-black text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentClasses.button}`}
          >
            Register Now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {isRegisterModalOpen && (
        <RegisterEvent
          event={event}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;
