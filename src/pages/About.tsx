import React from 'react';
import { Link } from 'wouter';
import { ShieldCheck, Target, Users, Mail, MapPin, Award, Terminal, Compass, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-900/40">
          Symposium Overview
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          About <span className="bg-gradient-to-r from-red-500 via-red-400 to-blue-500 bg-clip-text text-transparent">ITEKRON 2K26</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          The national flagship technical symposium hosted by the Department of Information Technology.
        </p>
      </div>

      {/* About Section & Department Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="spider-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-900/60 flex items-center justify-center text-red-400">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-white">The ITEKRON Vision</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            ITEKRON 2K26 is designed as a premier platform for aspiring engineers, developers, and tech enthusiasts from across the nation to test their knowledge, collaborate on real-world engineering problems, and showcase technical expertise.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Bringing together cutting-edge AI, modern software architecture, web development, and non-technical problem-solving challenges, the symposium bridges academic knowledge with industry standards.
          </p>
        </div>

        <div className="spider-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-950/80 border border-blue-900/60 flex items-center justify-center text-blue-400">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-white">Department of IT</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            The Department of Information Technology focuses on delivering high-impact engineering education, research excellence, and hands-on application development.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Our student organizers and faculty advisors work synergistically to host nationwide technical summits, empowering the next generation of software architects and technology leaders.
          </p>
        </div>
      </div>

      {/* What Participants Can Expect */}
      <div className="spider-card p-6 sm:p-10 rounded-3xl space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-white">What Participants Can Expect</h2>
          <p className="text-xs text-slate-400">Key highlights and takeaways across the single-day symposium experience.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2 text-center">
            <Award className="w-8 h-8 text-red-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Technical & Non-Tech Tracks</h3>
            <p className="text-xs text-slate-400">From code debugging to paper presentations and strategic gaming.</p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Nationwide Networking</h3>
            <p className="text-xs text-slate-400">Connect with peers, mentors, and engineering delegates nationwide.</p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-2 text-center">
            <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Digital Pass System</h3>
            <p className="text-xs text-slate-400">Automated registration verification and instant venue QR check-ins.</p>
          </div>
        </div>
      </div>

      {/* Contact & Venue Info */}
      <div className="spider-card p-6 sm:p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-blue-900/30">
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-white">Symposium Headquarters & Contact</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Have questions regarding event registrations, rules, or venue directions? Reach out directly to our student coordinator team.
          </p>
          <div className="space-y-2 text-xs text-slate-400 pt-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Department of IT, Engineering Campus, Main Auditorium</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>itekron2k26@college.edu</span>
            </div>
          </div>
        </div>

        <div className="text-center sm:text-right pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-8">
          <p className="text-xs text-slate-400 mb-4">Ready to test your technical skills?</p>
          <Link href="/events" className="spider-button-primary inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs font-bold">
            <span>Explore Events & Register</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;