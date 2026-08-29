import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LogOut, Ticket, Calendar, Award, Info, Home, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Navbar: React.FC = () => {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'ABOUT', path: '/about', icon: Info },
    { label: 'EVENTS', path: '/events', icon: Calendar },
    { label: 'SCHEDULE', path: '/schedule', icon: Calendar },
    { label: 'SPONSORS', path: '/sponsors', icon: Award },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05070c]/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO & BRANDING */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Custom Logo Image Container (Replaces Shield Icon) */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 p-1 rounded-xl bg-red-950/40 border border-red-900/40 flex items-center justify-center group-hover:border-red-500/80 transition duration-300 flex-shrink-0">
              <img
                src={logoImg}
                alt="ITEKRON 2K26 Emblem"
                className="w-full h-full object-contain transform group-hover:scale-110 transition duration-300"
              />
            </div>
            
            {/* ITEKRON Text (Unchanged) */}
            <div>
              <span className="text-xl font-black tracking-wider text-white flex items-center gap-1">
                ITEKRON <span className="text-red-500 text-xs font-mono font-bold bg-red-950/80 px-2 py-0.5 rounded-full border border-red-900/60">2K26</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest block uppercase">Department of Information Technology</span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider transition duration-200 ${
                    isActive
                      ? 'text-white bg-red-950/50 border border-red-900/60 shadow-lg shadow-red-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* USER ACTIONS / AUTH LOGIC */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/my-registrations"
                  className="spider-button-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Ticket className="w-4 h-4 text-red-400" />
                  <span>MY PASSES</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  LOG IN
                </Link>
                <Link
                  href="/signup"
                  className="spider-button-primary px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  REGISTER
                </Link>
              </div>
            )}
            
            {/* ORGANIZER PORTAL ACCESS LINK */}
            <Link
              href="/organizer/login"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-900/50 transition"
              title="Organizer Desk"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isOpen && (
        <div className="md:hidden bg-[#05070c]/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              <item.icon className="w-4 h-4 text-red-500" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  href="/my-registrations"
                  onClick={() => setIsOpen(false)}
                  className="spider-button-secondary w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold"
                >
                  <Ticket className="w-4 h-4 text-red-400" />
                  <span>MY DIGITAL PASSES</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SIGN OUT</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="spider-button-secondary py-3 text-center rounded-xl text-xs font-bold"
                >
                  LOG IN
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="spider-button-primary py-3 text-center rounded-xl text-xs font-bold"
                >
                  SIGN UP
                </Link>
              </div>
            )}
            <Link
              href="/organizer/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-950 border border-slate-900"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Organizer Verification Desk</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;