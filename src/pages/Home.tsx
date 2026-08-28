import React from 'react';
import { Link } from 'wouter';
import { ShieldCheck, Ticket, Users, Award, ArrowRight, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero Section */}
      <section className="text-center pt-12 pb-8 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-900/50 text-red-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Department of Information Technology</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-none">
          ITEKRON <span className="bg-gradient-to-r from-red-500 via-red-400 to-blue-500 bg-clip-text text-transparent">2K26</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          National Level Technical Symposium. Connect, compete, and showcase your skills across innovative technical and non-technical tracks.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/events" className="w-full sm:w-auto spider-button-primary px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center space-x-2">
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/signup" className="w-full sm:w-auto spider-button-secondary px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center space-x-2">
            <span>Register Account</span>
          </Link>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="spider-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-900/60 flex items-center justify-center text-red-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Technical Excellence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Paper presentations, code debugging, and web design challenges judged by industry veterans.
          </p>
        </div>

        <div className="spider-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-950/80 border border-blue-900/60 flex items-center justify-center text-blue-400">
            <Ticket className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Instant QR Passes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant digital passes generated upon registration for fast entry scanning at event venues.
          </p>
        </div>

        <div className="spider-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Seamless Check-In</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Streamlined organizer verification system ensuring real-time check-in confirmation and security.
          </p>
        </div>
      </section>
    </div>
  );
};