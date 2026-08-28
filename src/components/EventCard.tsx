import React from 'react';
import { Link } from 'wouter';
import { Event } from '../types/database';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Use exact logic as EventDetail.tsx (the reference implementation)
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
    <div className="spider-card p-6 rounded-3xl flex flex-col justify-between border-slate-800 space-y-5">
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
};

export default EventCard;