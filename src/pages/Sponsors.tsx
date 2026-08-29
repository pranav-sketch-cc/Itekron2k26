import React from 'react';
import { Award, ExternalLink } from 'lucide-react';

export const Sponsors: React.FC = () => {
  const sponsorList = [
    { name: 'Quantum ARC', tier: 'Technology & Certification Partner',category: 'Web Development, Technical Support & Certification' },
    
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
          Industry Collaborators
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Our <span className="text-blue-400">Sponsors & Partners</span>
        </h1>
        <p className="text-xs text-slate-400">
          Special thanks to our industry collaborators supporting technical education and event execution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sponsorList.map((s, idx) => (
          <div key={idx} className="spider-card spider-card-glow p-8 rounded-3xl text-center space-y-4">
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-900/50 w-fit mx-auto text-red-500">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider bg-red-950/50 px-2.5 py-0.5 rounded-full border border-red-900/40">
                {s.tier}
              </span>
              <h3 className="text-xl font-bold text-white mt-2">{s.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{s.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsors;