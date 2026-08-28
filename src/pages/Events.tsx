import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { EventCard } from '../components/EventCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Layers, AlertCircle } from 'lucide-react';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      setError('Failed to load events. Please try refreshing.');
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const categories = ['All', 'Technical', 'Non-Technical'];

  const filteredEvents = filter === 'All' 
    ? events 
    : events.filter(e => e.category?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
          Symposium Schedule
        </span>
        <h1 className="text-4xl font-extrabold text-white mt-3 tracking-tight">
          Explore <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Events</span>
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Compete across technical innovations and non-technical challenges. Register to earn your digital pass.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center items-center space-x-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              filter === cat
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* State Rendering */}
      {loading ? (
        <LoadingSpinner message="Fetching events from database..." />
      ) : error ? (
        <div className="spider-card max-w-md mx-auto p-6 rounded-2xl text-center text-red-300 space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
          <p className="text-sm">{error}</p>
          <button onClick={fetchEvents} className="spider-button-primary px-4 py-2 rounded-xl text-xs">
            Try Again
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="spider-card max-w-md mx-auto p-8 rounded-2xl text-center space-y-3 text-slate-400">
          <Layers className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-medium">No events found under this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};