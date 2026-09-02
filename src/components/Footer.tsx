import React from 'react';
import { Link } from 'wouter';
import { Mail, Phone } from 'lucide-react';
import logoImg from '../assets/logo.png';
import quantumArcLogo from '../assets/quantum-arc-logo.svg';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#030508] border-t border-slate-900/60 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1.5fr,1fr] gap-x-10 gap-y-12">
          {/* Logo & Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-12 sm:h-16 w-auto flex items-center justify-center bg-transparent flex-shrink-0">
                <img
                  src={logoImg}
                  alt="ITEKRON 2K26 Emblem"
                  className="h-full w-auto object-contain transform group-hover:scale-105 transition duration-300"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white flex items-center gap-1 leading-none">
                  ITEKRON{' '}
                  <span className="text-red-500 text-xs font-mono font-bold bg-red-950/80 px-2 py-0.5 rounded-full border border-red-900/60 leading-tight">
                    2K26
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-widest block uppercase mt-0.5">
                  Department of Information Technology
                </span>
              </div>
            </Link>

            <p className="leading-relaxed max-w-sm">
              ITEKRON 2K26 is the national level technical symposium organized by the Department of Information Technology, where innovation meets fierce competition.
            </p>
          </div>

          {/* Quick Links & Portals */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:col-span-2">
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

          {/* Quantum ARC Branding + Contact */}
          <div className="space-y-7 md:col-span-1">
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/80 p-2.5 shadow-lg shadow-blue-950/10">
                <img
                  src={quantumArcLogo}
                  alt="Quantum ARC"
                  className="w-24 sm:w-28 h-auto rounded-xl object-contain"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed max-w-[190px]">
                Quantum ARC
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Contact</h5>
              <ul className="space-y-3.5 text-slate-300">
                <li className="flex items-start gap-3">
                  <Phone className="w-3.5 h-3.5 text-red-500 mt-1 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="block text-slate-400 text-[10px] font-bold">Symposium Helpline</span>
                    <a href="tel:+917010438705" className="font-mono text-white hover:text-red-300 font-bold transition">
                      +91 70104 38705
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="w-3.5 h-3.5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <span className="block text-slate-400 text-[10px] font-bold">Official Event Email</span>
                    <span className="font-mono text-slate-300 italic">Coming soon</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
