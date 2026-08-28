import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Ticket, LogOut, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [location, setLocation] = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Sponsors', href: '/sponsors' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-red-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-red-500 via-red-400 to-blue-500 bg-clip-text text-transparent">
              ITEKRON <span className="text-white text-sm font-light">2K26</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors ${
                  location === link.href || (link.href !== '/' && location.startsWith(link.href))
                    ? 'text-red-400 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/my-registrations"
                  className={`flex items-center space-x-1.5 transition-colors ${
                    location === '/my-registrations' ? 'text-red-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Ticket className="w-4 h-4 text-red-500" />
                  <span>My Passes</span>
                </Link>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-800 lowercase font-normal">
                  <span className="text-xs text-slate-400 max-w-[120px] truncate">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 pl-2">
                <Link href="/login" className="text-slate-300 hover:text-white transition">
                  Login
                </Link>
                <Link href="/signup" className="spider-button-primary px-4 py-1.5 rounded-full text-xs">
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              href="/organizer/login"
              className="p-1.5 text-slate-500 hover:text-blue-400 transition ml-2"
              title="Organizer Access"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-red-950/60 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white uppercase tracking-wider font-semibold"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href="/my-registrations"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm text-red-400 font-bold uppercase tracking-wider"
              >
                My Passes
              </Link>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span className="truncate">{user.email}</span>
                <button onClick={handleSignOut} className="text-red-400 font-semibold">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm text-slate-300"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="spider-button-primary text-center py-2 rounded-lg text-xs font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link
            href="/organizer/login"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-xs text-blue-400 pt-2 border-t border-slate-900"
          >
            Organizer Portal &rarr;
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;