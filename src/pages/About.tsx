import React from 'react';
import { Target, Users, BookOpen, BrainCircuit, Mic, ShieldCheck, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export const About: React.FC = () => {
  // Static data for the Organizing Team
  const organizingTeam = [
    { role: 'HOD', name: 'Dr. S. Subburam', category: 'HEAD' },
    { role: 'STAFF COORDINATOR', name: 'Ms. R. Anitha', category: 'STAFF' },
    { role: 'STAFF COORDINATOR', name: 'Ms. S. Kanmani Jebaseeli', category: 'STAFF' },
    { role: 'PRESIDENT', name: 'K. Balaji', category: 'CORE' },
    { role: 'SECRETARY', name: 'M. Magiisha', category: 'CORE' },
    { role: 'TECHNICAL COORDINATOR', name: 'M. Nithya Sandhiya', category: 'TECH' },
    { role: 'TECHNICAL COORDINATOR', name: 'K. Prasanna', category: 'TECH' },
    { role: 'NON-TECHNICAL COORDINATOR', name: 'B. Vithya sri', category: 'NON_TECH' },
    { role: 'NON-TECHNICAL COORDINATOR', name: 'K. Sanjaykumar', category: 'NON_TECH' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 space-y-16">
      
      {/* 1. Page Header (Existing Section - Unchanged Content) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-950/40 px-3 py-1 rounded-full border border-blue-900/40">
          Our Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
          Behind the<br />
          <span className="bg-gradient-to-r from-red-500 via-red-600 to-blue-500 bg-clip-text text-transparent">
            Digital Matrix
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
          Welcome to <strong className="text-slate-200">ITEKRON 2K26</strong>, organized by the Department of Information Technology at <strong className="text-slate-200">New Prince Shri Bhavani College</strong>.
          Where innovation meets competition, we bridge the gap between emerging tech and technical mastery.
        </p>
      </section>

      {/* 2. Vision & Mission (Existing Section - Unchanged Content) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="spider-card p-8 rounded-3xl space-y-4 border-blue-900/40">
          <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-900/50 w-fit text-blue-500">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Our Vision</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            To cultivate an inclusive and high-octane engineering community where passion for technology transcends boundaries, fostering future-ready innovators and thought leaders.
          </p>
        </div>
        <div className="spider-card p-8 rounded-3xl space-y-4 border-red-900/40">
          <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-900/50 w-fit text-red-500">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Our Mission</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            To provide a premium platform for students to showcase technical brilliance, collaborative design prowess, and problem-solving ingenuity under intense competition, bridging industry standards with academic excellence.
          </p>
        </div>
      </section>

      {/* 
        ==================================================
        3. ORGANIZING TEAM SECTION (NEW)
        ==================================================
      */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800/80">
            Meet the Minds
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Organizing <span className="text-red-500">Team</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            The dedicated visionaries from the IT Department of New Prince Shri Bhavani College making ITEKRON 2K26 a reality.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizingTeam.map((member, index) => (
            <div 
              key={index}
              className={`
                spider-card p-6 rounded-2xl border flex items-center gap-4
                transition-all duration-300 ease-in-out
                hover:-translate-y-1.5 hover:shadow-2xl 
                ${
                  member.category === 'HEAD' ? 'border-red-800 shadow-lg shadow-red-950/40 hover:border-red-500 hover:shadow-red-900/60' :
                  member.category === 'STAFF' ? 'border-blue-900/60 hover:border-blue-500 hover:shadow-blue-900/40' :
                  'border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                }
              `}
            >
              {/* Category Icon */}
              <div className={`
                p-3 rounded-xl border flex items-center justify-center flex-shrink-0
                ${
                  member.category === 'HEAD' ? 'bg-red-950/80 border-red-900/60 text-red-500' :
                  member.category === 'STAFF' ? 'bg-blue-950/60 border-blue-900/50 text-blue-500' :
                  member.category === 'CORE' ? 'bg-red-950/40 border-red-900/40 text-red-600' :
                  member.category === 'TECH' ? 'bg-slate-900 border-slate-800 text-blue-400' :
                  'bg-slate-900 border-slate-800 text-slate-400'
                }
              `}>
                {member.category === 'HEAD' && <BookOpen className="w-5 h-5" />}
                {member.category === 'STAFF' && <Users className="w-5 h-5" />}
                {member.category === 'CORE' && <Mic className="w-5 h-5" />}
                {member.category === 'TECH' && <BrainCircuit className="w-5 h-5" />}
                {member.category === 'NON_TECH' && <ShieldCheck className="w-5 h-5" />}
              </div>

              {/* Name and Role */}
              <div className="space-y-0.5">
                <span className={`
                  text-[10px] font-extrabold uppercase tracking-widest block leading-tight
                  ${
                    member.category === 'HEAD' ? 'text-red-400' :
                    member.category === 'STAFF' ? 'text-blue-400' :
                    'text-slate-500'
                  }
                `}>
                  {member.role}
                </span>
                <span className="text-base sm:text-lg font-black text-white block leading-tight">
                  {member.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Support Contact (Existing Section - Unchanged Content) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="spider-card p-10 rounded-3xl relative overflow-hidden border border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr,auto] items-center gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
                Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Need Assistance?</h2>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                For registrations, partnerships, or any other inquiries, feel free to contact us via email or visit our department. Our team is always here to help.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="font-mono text-blue-400">[PLACEHOLDER_EMAIL]</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-red-500" />
                  <a href="tel:+917010438705" className="font-mono text-red-400 hover:text-red-300 transition">
                    +91 70104 38705
                  </a>
                </div>
              </div>
            </div>
            
            <div className="pt-4 md:pt-0">
              <Link href="/events" className="spider-button-primary px-8 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 group">
                <span>View All Events</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
          
          {/* Subtle Ambient Effect */}
          <div className="absolute inset-0 bg-spider-web opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

    </div>
  );
};

export default About;