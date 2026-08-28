import React from 'react';
import { Link } from 'wouter';
import { Event } from '../types/database';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isTeam = event.team_type === 'team';

  return (
    <div className="spider-card p-6 rounded-2xl flex flex-col justify-between group hover:border-red-500/40 transition">
      <div>
        {/* Category & Type Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/50 px-2.5 py-0.5 rounded-full">
            {event.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center space-x-1 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
            <Users className="w-3 h-3 text-blue-400" />
            <span>{isTeam ? `Team (${event.team_size})` : 'Individual'}</span>
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition mb-2">
          {event.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-5 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Meta Specs & Action */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{formatDate(event.date_time)}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{event.venue || 'TBA'}</span>
          </div>
        </div>

        <Link
          href={`/events/${event.id}`}
          className="spider-button-secondary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 group-hover:border-blue-500/60 transition"
        >
          <span>View Details & Rules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};