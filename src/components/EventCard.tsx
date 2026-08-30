import React from 'react';
import { useLocation } from 'wouter';

export interface EventCardProps {
  event: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    type?: string;
    team_type?: string;
    team_size?: string;
    date_time?: string;
    venue?: string;
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [, setLocation] = useLocation();

  const handleViewDetails = () => {
    if (event?.id) {
      setLocation(`/events/${event.id}`);
    }
  };

  const isConvera = event.id === 'CONVERA01';
  const price = isConvera ? '₹150' : '₹50';
  const isTeam = event.team_type?.toLowerCase() === 'team';

  return (
    <div className="spider-card p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono px-2.5 py-0.5 bg-red-950/80 border border-red-800 text-red-400 rounded-full">
            {event.category || 'Technical'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {isTeam ? 'Team Event' : 'Individual'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
        <p className="text-slate-400 text-xs line-clamp-2 mb-4">
          {event.description || 'No description provided.'}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-red-400 font-bold text-sm">{price}</span>
        <button
          onClick={handleViewDetails}
          className="spider-button-primary px-4 py-2 rounded-xl text-xs font-bold"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;