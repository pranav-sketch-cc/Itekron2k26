import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { formatDate } from '../lib/utils';
import techPoster from '../assets/overall_tech.jpeg';
import nonTechPoster from '../assets/overall_nontech.jpeg';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Technical');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (!error && data) setEvents(data);
    setLoading(false);
  };

  const categories = useMemo(() => {
    const available = Array.from(
      new Set(events.map((event) => event.category).filter(Boolean))
    ) as string[];

    return available
      .filter((category) => {
        const value = category.trim().toLowerCase();
        return value === 'technical' || value === 'non-technical';
      })
      .sort((a, b) => {
        const order = ['technical', 'non-technical'];
        return order.indexOf(a.trim().toLowerCase()) - order.indexOf(b.trim().toLowerCase());
      });
  }, [events]);

  const filteredEvents = events.filter(
    (event) => event.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
  );

  const selectedPoster = selectedCategory.trim().toLowerCase() === 'technical' ? techPoster : nonTechPoster;
  const isTechnicalCategory = selectedCategory.trim().toLowerCase() === 'technical';

  return (
    <div className="events-page relative min-h-screen overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-red-600/10 blur-3xl animate-pulse" />
        <div className="absolute right-[5%] top-[35%] h-80 w-80 rounded-full bg-blue-600/10 blur-3xl animate-pulse [animation-delay:1.2s]" />
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="events-hero relative text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-900/40 shadow-lg shadow-red-950/20">
          <Sparkles className="w-3 h-3" />
          ITEKRON 2K26 Events
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95]">
          Enter the <span className="bg-gradient-to-r from-red-500 via-red-400 to-blue-500 bg-clip-text text-transparent">Arena</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-6">
          Explore technical challenges, creative competitions, and high-energy events. Find your challenge and step into the arena.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="events-filters flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const active = selectedCategory.trim().toLowerCase() === cat.trim().toLowerCase();
            const isTechnical = cat.trim().toLowerCase() === 'technical';
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

      {/* Category poster */}
      <section className="events-poster relative max-w-5xl mx-auto w-full">
        <div className="group relative overflow-hidden rounded-[2rem] border border-slate-700/80 bg-slate-950/80 shadow-2xl shadow-black/30 transition-all duration-700 hover:-translate-y-1 hover:border-slate-500">
          <div className={`absolute inset-0 bg-gradient-to-r ${isTechnicalCategory ? 'from-red-950/50 via-transparent to-transparent' : 'from-blue-950/50 via-transparent to-transparent'} pointer-events-none z-10`} />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-700 z-10 pointer-events-none" />
          <img
            src={selectedPoster}
            alt={`${selectedCategory} events poster`}
            className="w-full h-auto max-h-[620px] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-transparent">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className={`inline-flex text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${isTechnicalCategory ? 'text-red-300 bg-red-950/70 border-red-800/60' : 'text-blue-300 bg-blue-950/70 border-blue-800/60'}`}>
                  {selectedCategory} Arena
                </span>
                <h2 className="mt-2 text-xl sm:text-3xl font-black text-white">Explore the {selectedCategory} events</h2>
              </div>
              <Sparkles className={`hidden sm:block w-7 h-7 flex-shrink-0 ${isTechnicalCategory ? 'text-red-400' : 'text-blue-400'} animate-pulse`} />
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      {loading ? (
        <div className="py-16 flex justify-center"><LoadingSpinner message="Loading events schedule..." /></div>
      ) : filteredEvents.length === 0 ? (
        <div className="spider-card relative overflow-hidden rounded-3xl border border-slate-800/80 text-center text-slate-400 py-16 text-xs">
          No events available in this category.
        </div>
      ) : (
        <div className="events-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const rawType = (event.event_type || event.team_type || '').toLowerCase();
            const eventId = String(event.id || '').trim().toUpperCase();
            const eventName = event.name?.trim().toLowerCase() || '';
            const isFixedThreeMemberTeam =
              eventId === 'DREADENCRYPTA01' ||
              eventId === 'MINDMOSAIC01' ||
              eventName === 'dreaden crypta' ||
              eventName.startsWith('dreaden crypta —') ||
              eventName === 'mind mosaic';
            const numericTeamSize = isFixedThreeMemberTeam ? 3 : Number(event.max_team_size || event.team_size || 1);

            let typeLabel = 'Individual';
            if (rawType === 'both') typeLabel = 'Individual & Team';
            else if (rawType === 'team' || numericTeamSize > 1 || isFixedThreeMemberTeam) typeLabel = `Team (${numericTeamSize})`;

            const isTechnical = event.category?.trim().toLowerCase() === 'technical';
            const isConvera = event.name?.trim().toLowerCase().includes('convera');
            const fee = isConvera ? '₹150' : isTechnical ? '₹50' : 'FREE';
            const accent = isTechnical ? 'red' : 'blue';

            return (
              <div
                key={event.id}
                className="event-scroll-card group relative overflow-hidden spider-card rounded-3xl border border-slate-800/80 p-6 flex flex-col justify-between space-y-5 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100 ${accent === 'red' ? 'bg-red-500/20' : 'bg-blue-500/20'}`} />
                <div className={`pointer-events-none absolute left-0 right-0 top-0 h-px scale-x-50 opacity-50 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100 ${accent === 'red' ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'}`} />
                <div className="pointer-events-none absolute right-5 top-14 text-6xl font-black text-white/[0.025] select-none">{String(index + 1).padStart(2, '0')}</div>

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start gap-3 text-[10px]">
                    <span className={`font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${accent === 'red' ? 'text-red-400 bg-red-950/60 border-red-900/40' : 'text-blue-400 bg-blue-950/60 border-blue-900/40'}`}>{event.category || 'Symposium'}</span>
                    <span className="text-slate-300 flex items-center gap-1 font-semibold bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800"><Users className="w-3 h-3 text-blue-400" /><span>{typeLabel}</span></span>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white leading-snug transition-transform duration-300 group-hover:translate-x-1">{event.name}</h2>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">{event.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className={`text-xs font-black ${accent === 'red' ? 'text-red-400' : 'text-blue-400'}`}>{fee}</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">Entry Fee</span>
                  </div>
                </div>

                <div className="relative z-10 space-y-4 pt-3 border-t border-slate-800/80">
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><Calendar className={`w-3.5 h-3.5 flex-shrink-0 ${accent === 'red' ? 'text-red-400' : 'text-blue-400'}`} /><span>{formatDate(event.date_time)}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /><span>{event.venue || 'TBA'}</span></div>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group/btn ${accent === 'red' ? 'bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-950/20' : 'bg-blue-600/90 hover:bg-blue-500 text-white shadow-lg shadow-blue-950/20'}`}
                  >
                    <span>View Details</span><ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
