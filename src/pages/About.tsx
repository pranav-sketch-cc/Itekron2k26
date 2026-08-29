import React from 'react';
import { Shield, Cpu, Target, Award, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
          Symposium Overview
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About <span className="text-red-500">ITEKRON 2K26</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Empowering engineering minds through competitive technical challenges and collaborative problem solving.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="spider-card p-8 rounded-3xl space-y-4">
          <div className="p-3 rounded-2xl bg-red-950/60 border border-red-900/50 w-fit text-red-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Department Mission</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Department of Information Technology strives to cultivate industry-ready software developers and AI practitioners. ITEKRON 2K26 serves as an experimental arena for applying academic theory to real-world code.
          </p>
        </div>

        <div className="spider-card p-8 rounded-3xl space-y-4">
          <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-900/50 w-fit text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Technical Highlights</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Participants engage in algorithmic coding, web debugging, paper presentations, and UI/UX design. Winners receive cash prizes, merit certificates, and recognition.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="spider-card p-8 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-red-400" />
          <span>Symposium Offerings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          {[
            'Verified Digital Pass with QR verification',
            'Cash prize awards for top performers',
            'On-campus lunch & refreshment facilities',
            'Participation certificates for all registered candidates',
            'Networking opportunities with engineering peers',
            'Expert faculty jury evaluations',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;