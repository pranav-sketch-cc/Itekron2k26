import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const categories = useMemo(() => {
    const available = Array.from(new Set(events.map((e) => e.category).filter(Boolean))) as string[];
    return available.filter((category) => {
      const normalized = category.trim().toLowerCase();
      return normalized === 'technical' || normalized === 'non-technical';
    });
  }, [events]);

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-red-600/10 blur-3xl animate-pulse" />
        <div className="absolute right-[5%] top-[35%] h-80 w-80 rounded-full bg-blue-600/10 blur-3xl animate-pulse [animation-delay:1.2s]" />
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      {/* Header */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-900/40 shadow-lg shadow-red-950/20">
          <Sparkles className="w-3 h-3" />
          ITEKRON 2K26 Events
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95]">
          Enter the{' '}
          <span className="bg-gradient-to-r from-red-500 via-red-400 to-blue-500 bg-clip-text text-transparent">Arena</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-6">
          Explore technical challenges, creative competitions, and high-energy events. Find your challenge and step into the arena.
        </p>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const isTechnical = cat.trim().toLowerCase() === 'technical';
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(active ? 'All' : cat)}
                className={`group relative overflow-hidden px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  active
                    ? isTechnical
                      ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-950/50 scale-105'
                      : 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-950/50 scale-105'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600 hover:-translate-y-0.5'
                }`}
              >
                <span className="relative z-10">{cat}</span>
                {active && <span className="absolute inset-0 bg-white/10 animate-pulse" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner message="Loading events schedule..." />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="spider-card relative overflow-hidden rounded-3xl border border-slate-800/80 text-center text-slate-400 py-16 text-xs">
          No events available in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const rawType = (event.event_type || event.team_type || '').toLowerCase();
            const numericTeamSize = Number(event.max_team_size || event.team_size || 1);

            let typeLabel = 'Individual';
            if (rawType === 'both') {
              typeLabel = 'Individual & Team';
            } else if (rawType === 'team' || numericTeamSize > 1) {
              typeLabel = `Team (${numericTeamSize})`;
            } else if (rawType === 'individual') {
              typeLabel = 'Individual';
            }

            const isTechnical = event.category?.trim().toLowerCase() === 'technical';
            const isConvera = event.name?.trim().toLowerCase().includes('convera');
            const fee = isConvera ? '₹150' : isTechnical ? '₹50' : 'FREE';
            const accent = isTechnical ? 'red' : 'blue';

            return (
              <div
                key={event.id}
                className="group relative overflow-hidden spider-card rounded-3xl border border-slate-800/80 p-6 flex flex-col justify-between space-y-5 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Hover spotlight */}
                <div className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100 ${accent === 'red' ? 'bg-red-500/20' : 'bg-blue-500/20'}`} />
                <div className={`pointer-events-none absolute left-0 right-0 top-0 h-px scale-x-50 opacity-50 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100 ${accent === 'red' ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'}`} />
                <div className="pointer-events-none absolute right-5 top-14 text-6xl font-black text-white/[0.025] select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start gap-3 text-[10px]">
                    <span className={`font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${accent === 'red' ? 'text-red-400 bg-red-950/60 border-red-900/40' : 'text-blue-400 bg-blue-950/60 border-blue-900/40'}`}>
                      {event.category || 'Symposium'}
                    </span>
                    <span className="text-slate-300 flex items-center gap-1 font-semibold bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span>{typeLabel}</span>
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white leading-snug transition-transform duration-300 group-hover:translate-x-1">
                      {event.name}
                    </h2>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className={`text-xs font-black ${accent === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
                      {fee}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Entry Fee
                    </span>
                  </div>
                </div>

                <div className="relative z-10 space-y-4 pt-3 border-t border-slate-800/80">
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-3.5 h-3.5 flex-shrink-0 ${accent === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
                      <span>{formatDate(event.date_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{event.venue || 'TBA'}</span>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group/btn ${
                      accent === 'red'
                        ? 'bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-950/20'
                        : 'bg-blue-600/90 hover:bg-blue-500 text-white shadow-lg shadow-blue-950/20'
                    }`}
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;