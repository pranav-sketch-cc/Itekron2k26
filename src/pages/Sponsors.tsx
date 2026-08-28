import React from 'react';
import { Link } from 'wouter';
import { Building2, Award, Zap, HeartHandshake, ArrowRight } from 'lucide-react';

interface Sponsor {
  name: string;
  category: 'Title Sponsor' | 'Platinum Partner' | 'Gold Sponsor' | 'Technical Partner';
  description: string;
  tier: 'title' | 'platinum' | 'gold' | 'tech';
}

const SPONSORS_DATA: Sponsor[] = [
  {
    name: 'TechCorp Innovations',
    category: 'Title Sponsor',
    description: 'Leading provider of cloud infrastructure and NextGen enterprise software solutions.',
    tier: 'title',
  },
  {
    name: 'Nexus Cybernetics',
    category: 'Platinum Partner',
    description: 'Pioneering artificial intelligence research and automated robotics platforms.',
    tier: 'platinum',
  },
  {
    name: 'Apex Software Labs',
    category: 'Gold Sponsor',
    description: 'Specializing in high-performance web engineering and mobile app frameworks.',
    tier: 'gold',
  },
  {
    name: 'CloudSync Technologies',
    category: 'Technical Partner',
    description: 'Powering real-time database infrastructure and scalable API services.',
    tier: 'tech',
  },
];

export const Sponsors: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-900/40">
          Partners & Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Symposium <span className="bg-gradient-to-r from-red-500 via-red-400 to-blue-500 bg-clip-text text-transparent">Sponsors</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          We are proud to collaborate with industry leaders empowering technical innovation at ITEKRON 2K26.
        </p>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SPONSORS_DATA.map((sponsor, idx) => (
          <div
            key={idx}
            className={`spider-card p-6 sm:p-8 rounded-3xl space-y-4 border transition ${
              sponsor.tier === 'title'
                ? 'border-red-500/50 shadow-lg shadow-red-950/20'
                : sponsor.tier === 'platinum'
                ? 'border-blue-500/40'
                : 'border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400 font-extrabold text-xl">
                  {sponsor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{sponsor.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-900/50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {sponsor.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {sponsor.description}
            </p>
          </div>
        ))}
      </div>

      {/* Sponsor CTA Box */}
      <div className="spider-card p-8 sm:p-12 rounded-3xl text-center max-w-3xl mx-auto space-y-6 border-blue-900/40">
        <HeartHandshake className="w-12 h-12 text-blue-400 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Partner with ITEKRON 2K26</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Interested in sponsoring our national technical symposium and engaging with top engineering talent? Connect with our sponsorship committee.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/about" className="spider-button-primary inline-flex items-center space-x-2 px-8 py-3 rounded-full text-xs font-bold">
            <span>Contact Sponsorship Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;