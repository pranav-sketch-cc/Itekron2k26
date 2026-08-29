import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

export const Schedule: React.FC = () => {
  const timeline = [
    { time: '08:30 AM - 09:30 AM', title: 'On-Spot Desk Verification & Pass Pickup', venue: 'Main Entrance Desk', status: 'Mandatory' },
    { time: '09:30 AM - 10:15 AM', title: 'Grand Inauguration Ceremony', venue: 'Main Auditorium', status: 'General' },
    { time: '10:30 AM - 12:30 PM', title: 'Morning Event Sessions (Technical & Non-Tech)', venue: 'Respective Labs / Rooms', status: 'Competitive' },
    { time: '12:30 PM - 01:30 PM', title: 'Symposium Lunch Break', venue: 'Dining Hall', status: 'Break' },
    { time: '01:30 PM - 03:30 PM', title: 'Final Coding & Presentation Rounds', venue: 'IT Computer Labs', status: 'Competitive' },
    { time: '03:45 PM - 04:30 PM', title: 'Valedictory Function & Prize Distribution', venue: 'Main Auditorium', status: 'Ceremony' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
          26 September 2026
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Event <span className="text-red-500">Timeline & Schedule</span>
        </h1>
        <p className="text-xs text-slate-400">
          Please adhere to scheduled timelines for seamless desk check-in and competition access.
        </p>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800 hidden sm:block" />

      <div className="space-y-4">
        {timeline.map((slot, idx) => (
          <div key={idx} className="spider-card p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-800/80">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs text-red-400 font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{slot.time}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{slot.title}</h3>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 text-blue-400" />
                <span>{slot.venue}</span>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 w-fit">
              {slot.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;