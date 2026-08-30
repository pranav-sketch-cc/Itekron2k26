import React from 'react';
import { Link } from 'wouter';
import { Mail, MapPin, Phone, Building2 } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#030508] border-t border-slate-900/60 text-slate-400 text-xs mt-auto">
      
      {/* 1. Main Footer Content (Modified Grid structure) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Desktop Layout: Links | Portals | Venue | Contact (4 cols) */}
        {/* Mobile/Tablet: Stacked or smaller grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1.5fr,1fr] gap-x-10 gap-y-12">
          
          {/* Logo & Info (1st Col) */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 p-1 rounded-xl bg-red-950/40 border border-red-900/40 flex items-center justify-center group-hover:border-red-500/80 transition duration-300 flex-shrink-0">
                <img
                  src={logoImg}
                  alt="ITEKRON 2K26 Emblem"
                  className="w-full h-full object-contain transform group-hover:scale-110 transition duration-300"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white flex items-center gap-1 leading-none">
                  ITEKRON <span className="text-red-500 text-xs font-mono font-bold bg-red-950/80 px-2 py-0.5 rounded-full border border-red-900/60 leading-tight">2K26</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-widest block uppercase mt-0.5">Department of Information Technology</span>
              </div>
            </Link>
            <p className="leading-relaxed max-w-sm">
              ITEKRON 2K26 is the national level technical symposium organized by the Department of Information Technology, where innovation meets fierce competition.
            </p>
          </div>

          {/* Quick Links & Portals (2nd & 3rd Col on Desktop, Grid on Mobile) */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:col-span-2">
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Quick Links</h5>
              <ul className="space-y-2.5">
                {[
                  { label: 'About Page', href: '/about' },
                  { label: 'Event Schedule', href: '/schedule' },
                  { label: 'Symposium Sponsors', href: '/sponsors' },
                  { label: 'Core Organizing Team', href: '/about#team' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="hover:text-red-400 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portals */}
            <div className="space-y-4">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Portals</h5>
              <ul className="space-y-2.5">
                {[
                  { label: 'Participant Log In', href: '/login' },
                  { label: 'Organizer Portal Desk', href: '/organizer/login' },
                  { label: 'System Check-In Scanner', href: '/organizer/scanner' },
                  { label: 'Admin Dashboard Hub', href: '/admin/login' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="hover:text-blue-400 transition font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 
            ==================================================
            CONTACT SECTION (NEW, 4th Col on Desktop)
            ==================================================
          */}
          <div className="space-y-4 md:col-span-1">
            <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Contact</h5>
            <ul className="space-y-3.5 text-slate-300">
              
              {/* Phone (Clickable tel link) */}
              <li className="flex items-start gap-3">
                <Phone className="w-3.5 h-3.5 text-red-500 mt-1 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="block text-slate-400 text-[10px] font-bold">Symposium Helpline</span>
                  <a href="tel:+917010438705" className="font-mono text-white hover:text-red-300 font-bold transition">
                    +91 70104 38705
                  </a>
                </div>
              </li>
              
              {/* Email Placeholder (Non-clickable text) */}
              <li className="flex items-start gap-3">
                <Mail className="w-3.5 h-3.5 text-blue-500 mt-1 flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="block text-slate-400 text-[10px] font-bold">Official Event Email</span>
                  <span className="font-mono text-slate-300 italic">
                    Coming soon
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* 3. Copyright Bar (Existing Section - Unchanged Content) */}
      <div className="border-t border-slate-900/60 bg-[#020406] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between text-slate-600 font-mono text-[10px]">
          <p>&copy; 2026 ITEKRON Symposium Department of IT. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 italic">New Prince Shri Bhavani College, Santhosapuram, Chennai 600069</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;