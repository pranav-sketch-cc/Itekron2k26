import React from 'react';
import { ArrowRight, Calendar, CheckCircle2, Clock3, MapPin, Sparkles, Utensils } from 'lucide-react';

export const Schedule: React.FC = () => {
  const timeline = [
    { time: '08:30 AM - 09:30 AM', title: 'On-Spot Desk Verification & Pass Pickup', venue: 'Main Entrance Desk', status: 'Mandatory', icon: CheckCircle2 },
    { time: '09:30 AM - 10:15 AM', title: 'Grand Inauguration Ceremony', venue: 'Main Auditorium', status: 'General', icon: Sparkles },
    { time: '10:30 AM - 12:30 PM', title: 'Morning Event Sessions (Technical & Non-Tech)', venue: 'Respective Labs / Rooms', status: 'Competitive', icon: Clock3 },
    { time: '12:30 PM - 01:30 PM', title: 'Symposium Lunch Break', venue: 'Dining Hall', status: 'Break', icon: Utensils },
    { time: '01:30 PM - 03:30 PM', title: 'Final Coding & Presentation Rounds', venue: 'IT Computer Labs', status: 'Competitive', icon: Clock3 },
    { time: '03:45 PM - 04:30 PM', title: 'Valedictory Function & Prize Distribution', venue: 'Main Auditorium', status: 'Ceremony', icon: Sparkles },
  ];

  const competitiveCount = timeline.filter((slot) => slot.status === 'Competitive').length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-[120px]" />
        <div className="absolute right-0 top-[42%] h-80 w-80 rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <div className="max-w-5xl mx-auto">
        <section className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-900/50 bg-red-950/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-red-400 shadow-lg shadow-red-950/20">
            <Calendar className="w-3.5 h-3.5" />
            26 September 2026
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
            <span className="h-px w-10 bg-slate-800" />
            ITEKRON 2K26
            <span className="h-px w-10 bg-slate-800" />
          </div>

          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white">
            Event <span className="text-red-500">Schedule</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-7 text-slate-400">
            Your complete timeline for verification, competition sessions, breaks and the grand finale. Stay on time and make every moment count.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-3 text-left backdrop-blur-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Schedule Blocks</p>
              <p className="mt-1 text-xl font-black text-white">{timeline.length}</p>
            </div>
            <div className="rounded-2xl border border-red-900/40 bg-red-950/20 px-5 py-3 text-left backdrop-blur-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-400/70">Competition Blocks</p>
              <p className="mt-1 text-xl font-black text-red-400">{competitiveCount}</p>
            </div>
            <div className="rounded-2xl border border-blue-900/40 bg-blue-950/20 px-5 py-3 text-left backdrop-blur-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400/70">Event Day</p>
              <p className="mt-1 text-xl font-black text-blue-300">1 Day</p>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute left-[20px] top-6 bottom-6 w-px bg-gradient-to-b from-red-500/70 via-slate-700 to-blue-500/70 sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-7 sm:space-y-10">
            {timeline.map((slot, idx) => {
              const Icon = slot.icon;
              const isLeft = idx % 2 === 0;
              const isBreak = slot.status === 'Break';

              return (
                <div key={idx} className={`relative flex items-center ${isLeft ? 'sm:justify-start' : 'sm:justify-end'}`}>
                  <div className="absolute left-[20px] z-20 flex h-3 w-3 -translate-x-1/2 items-center justify-center sm:left-1/2">
                    <span className={`absolute h-5 w-5 rounded-full blur-md ${isBreak ? 'bg-blue-400/30' : 'bg-red-500/30'}`} />
                    <span className={`relative h-3 w-3 rounded-full border-2 border-slate-950 ${isBreak ? 'bg-blue-400' : 'bg-red-500'}`} />
                  </div>

                  <article className={`group ml-10 w-full max-w-xl overflow-hidden rounded-3xl border bg-slate-950/75 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-red-950/20 sm:ml-0 sm:w-[calc(50%-38px)] ${isBreak ? 'border-blue-900/50 hover:border-blue-500/60' : 'border-slate-800 hover:border-red-900/70'}`}>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${isBreak ? 'text-blue-400' : 'text-red-400'}`}>
                          <Clock3 className="h-3.5 w-3.5" />
                          {slot.time}
                        </div>
                        <h2 className="mt-3 text-base sm:text-lg font-black leading-snug text-white transition-colors group-hover:text-slate-100">
                          {slot.title}
                        </h2>
                      </div>

                      <div className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${isBreak ? 'border-blue-900/60 bg-blue-950/30 text-blue-400' : 'border-red-900/50 bg-red-950/30 text-red-400'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                        {slot.venue}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 font-bold uppercase tracking-wider ${isBreak ? 'border-blue-900/50 bg-blue-950/20 text-blue-300' : 'border-slate-800 bg-slate-900/80 text-slate-300'}`}>
                        {slot.status}
                      </span>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 sm:mt-20 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950/90 to-red-950/20 p-7 sm:p-10 text-center shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Plan your day</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">Ready to compete?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Explore the events, choose your challenge and be ready before your scheduled session begins.
          </p>
          <a href="/events" className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-950/30 transition-all duration-300 hover:-translate-y-1 hover:bg-red-500">
            Explore Events
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </div>
    </div>
  );
};

export default Schedule;