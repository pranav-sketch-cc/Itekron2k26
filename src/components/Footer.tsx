import React from 'react';
import { Link } from 'wouter';
import { Shield, Mail, MapPin, Phone, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030408] border-t border-slate-800/80 pt-16 pb-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* BRAND */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-base font-black text-white">ITEKRON 2K26</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              National Level Technical Symposium organized by the Department of Information Technology.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/events" className="hover:text-white transition">All Events</Link></li>
              <li><Link href="/schedule" className="hover:text-white transition">Event Schedule</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Symposium</Link></li>
              <li><Link href="/sponsors" className="hover:text-white transition">Sponsors</Link></li>
            </ul>
          </div>

          {/* PARTICIPANT LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2">
              <li><Link href="/my-registrations" className="hover:text-white transition">My Pass Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Participant Login</Link></li>
              <li><Link href="/organizer/login" className="hover:text-white transition">Organizer Verification Portal</Link></li>
            </ul>
          </div>

          {/* VENUE & CONTACT */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Venue Location</h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Department of Information Technology, Campus Auditorium</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>itekron2k26@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
          <p>© 2026 ITEKRON. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted for ITEKRON 2K26 Technical Symposium</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;