import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
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

  const categories = ['All', ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
          ITEKRON 2K26 Events
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Symposium <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Events & Competitions</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Explore technical challenges, hackathons, and creative presentations. Select an event to register.
        </p>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner message="Loading events schedule..." />
      ) : filteredEvents.length === 0 ? (
        <div className="text-center text-slate-400 py-12 text-xs">
          No events available in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
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

            return (
              <div key={event.id} className="spider-card p-6 rounded-3xl flex flex-col justify-between border-slate-800 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-900/40">
                      {event.category || 'Symposium'}
                    </span>
                    <span className="text-slate-300 flex items-center space-x-1 font-semibold bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span>{typeLabel}</span>
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white leading-snug">{event.name}</h2>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{event.description}</p>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span>{formatDate(event.date_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{event.venue || 'TBA'}</span>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="spider-button-primary w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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