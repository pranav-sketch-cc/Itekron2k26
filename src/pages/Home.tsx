import React from 'react';
import { Link } from 'wouter';
import { Calendar, Award, Users, ArrowRight, Shield, Cpu, Code2, Sparkles, Terminal } from 'lucide-react';
import heroImg from '../assets/output.png';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 space-y-20">
      
      {/* FULL-BLEED / LARGE HERO CONTAINER */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-[85vh] flex items-center px-4 sm:px-8 lg:px-16 overflow-hidden my-0">
        
        {/* 1. Full-Width Background Visual Container (Anchored Center-Top) */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="ITEKRON 2K26 Visual Background"
            className="w-full h-full object-cover object-top"
          />
          {/* Dark Gradients for High Text Legibility & Background Transition */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#04060a] via-[#04060a]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-transparent to-[#04060a]/60" />
          <div className="absolute inset-0 bg-spider-web opacity-20 pointer-events-none" />
        </div>

        {/* 2. Layered Content Area (Left-Aligned Text Layered Over Image) */}
        <div className="relative z-10 py-16 lg:py-24 max-w-4xl mx-auto lg:mx-0 text-left space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-red-950/70 border border-red-900/60 px-4 py-1.5 rounded-full text-red-400 text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-950/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>National Level Technical Symposium</span>
          </div>

          {/* Main Heading: ITEKRON 2K26 */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
            ITEKRON <br />
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-blue-500 bg-clip-text text-transparent">
              2K26
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed drop-shadow-md">
            Welcome to <strong className="text-white">ITEKRON 2K26</strong>, organized by the Department of Information Technology.
            Test your technical prowess, hackathon ingenuity, and UI design precision in a high-octane engineering arena.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/events"
              className="spider-button-primary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 group"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </Link>
            <Link
              href="/signup"
              className="spider-button-secondary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2"
            >
              <span>REGISTER NOW</span>
            </Link>
          </div>

          {/* Quick Event Stats Grid */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Technical Events', val: '10+', icon: Cpu },
              { label: 'Cash Prize Pool', val: '₹50,000+', icon: Award },
              { label: 'Colleges Expected', val: '50+', icon: Users },
              { label: 'Symposium Date', val: '26 SEPT 2026', icon: Calendar },
            ].map((stat, idx) => (
              <div key={idx} className="spider-card p-3.5 rounded-2xl text-left space-y-1 bg-slate-950/80 backdrop-blur-md">
                <stat.icon className="w-4 h-4 text-red-500 mb-1" />
                <span className="text-base font-black text-white block">{stat.val}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURED EVENT CATEGORIES (UNCHANGED) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
            Competitions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for <span className="text-blue-400">Innovators</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose from technical debugging, coding challenges, meme creation, and project showcases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="spider-card spider-card-glow p-8 rounded-3xl space-y-4">
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-900/50 w-fit text-red-500">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Coding & Debugging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test your logic and language proficiency in high-speed web debugging and code optimization challenges.
            </p>
            <Link href="/events" className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center space-x-1">
              <span>View Technical Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="spider-card spider-card-glow p-8 rounded-3xl space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-900/50 w-fit text-blue-500">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Design & UI/UX</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Craft responsive user interfaces and cinematic digital visuals under strict symposium time limits.
            </p>
            <Link href="/events" className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1">
              <span>View Design Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="spider-card spider-card-glow p-8 rounded-3xl space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit text-slate-300">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Non-Technical</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express Gen Z creativity in meme creation, gaming showdowns, and rapid quiz rounds.
            </p>
            <Link href="/events" className="text-xs font-bold text-slate-300 hover:text-white inline-flex items-center space-x-1">
              <span>Explore Non-Tech</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER (UNCHANGED) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="spider-card p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden border-red-900/50">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Ready to Claim Your Spot?</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Registration provides entry to symposium events, digital passes, food options, and official certificates.
            </p>
            <div className="pt-2">
              <Link href="/signup" className="spider-button-primary px-8 py-3.5 rounded-2xl text-xs font-bold inline-block">
                Register for ITEKRON 2K26
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;