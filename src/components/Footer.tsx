import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        <p className="tracking-wide">
          © 2026 <span className="text-slate-300 font-semibold">ITEKRON 2K26</span> — Department of Information Technology
        </p>
        <p className="text-slate-600">National Level Technical Symposium</p>
      </div>
    </footer>
  );
};

export default Footer;