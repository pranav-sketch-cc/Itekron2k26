import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '../lib/supabase';
import { Event } from '../types/database';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Clock, MapPin, Calendar, Layers, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface ScheduleItem {
  time: string;
  title: string;
  category: string;
  venue: string;
  description: string;
}

const FALLBACK_SCHEDULE: ScheduleItem[] = [
  {
    time: '08:30 AM - 09:30 AM',
    title: 'Registration & Verification Desk',
    category: 'General',
    venue: 'Main Foyer / Helpdesk',
    description: 'On-site registration check-in, QR pass validation, and welcome kit distribution.',
  },
  {
    time: '09:30 AM - 10:15 AM',
    title: 'Inaugural Ceremony & Keynote Address',
    category: 'General',
    venue: 'Main Auditorium',
    description: 'Welcome address by HOD / Chief Guest keynote on emerging AI & software architectures.',
  },
  {
    time: '10:30 AM - 01:00 PM',
    title: 'Morning Technical Sessions & Paper Presentations',
    category: 'Technical',
    venue: 'IT Block Labs & Seminar Halls',
    description: 'Technical paper presentation, coding challenges, and web development tracks.',
  },
  {
    time: '01:00 PM - 02:00 PM',
    title: 'Lunch Break & Networking',
    category: 'General',
    venue: 'Student Cafeteria',
    description: 'Lunch served for registered participants and organizers.',
  },
  {
    time: '02:00 PM - 04:00 PM',
    title: 'Afternoon Non-Technical & Gaming Events',
    category: 'Non-Technical',
    venue: 'Seminar Hall 2 & Outdoor Arena',
    description: 'Non-technical challenges, tech trivia, and gaming tournaments.',
  },
  {
    time: '04:15 PM - 05:00 PM',
    title: 'Valedictory & Prize Distribution',
    category: 'General',
    venue: 'Main Auditorium',
    description: 'Announcement of event winners, cash prize distribution, and closing ceremony.',
  },
];

export const Schedule: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEventsSchedule();
  }, []);

  const fetchEventsSchedule = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (data && data.length > 0) {
      setEvents(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-900/40">
          Symposium Timeline
        </span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Event <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Schedule</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Plan your day at ITEKRON 2K26. Check timings, venues, and competition slots.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading schedule..." />
      ) : (
        <div className="space-y-10">
          {/* Dynamic Events Schedule from Supabase */}
          {events.length > 0 && (
            <div className="spider-card p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
                <Calendar className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-bold text-white">Registered Competitions & Tracks</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-red-500/30 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/50 px-2.5 py-0.5 rounded-full">
                          {evt.category}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                          {evt.team_type === 'team' ? `Team (${evt.team_size})` : 'Individual'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{evt.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {formatDate(evt.date_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {evt.venue || 'TBA'}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${evt.id}`}
                      className="spider-button-secondary py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 sm:self-center"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Master Day Timeline */}
          <div className="spider-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Master Day Timeline</h2>
            </div>

            <div className="relative border-l border-slate-800 ml-3 sm:ml-6 space-y-8 pl-6 sm:pl-8">
              {FALLBACK_SCHEDULE.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-red-500 border-4 border-slate-950 group-hover:scale-125 transition" />

                  <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded-md border border-red-900/40">
                        {item.time}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                    <div className="flex items-center space-x-1 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;