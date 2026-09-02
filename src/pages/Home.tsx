import React from 'react';
import { Link } from 'wouter';
import {
  Calendar,
  ArrowRight,
  Shield,
  Cpu,
  Code2,
  Sparkles,
  Terminal,
  UserPlus,
  CreditCard,
  Ticket,
  CheckCircle2,
} from 'lucide-react';
import heroImg from '../assets/output.png';

const registrationSteps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Sign up with your email and verify your account before registering for an event.',
    icon: UserPlus,
  },
  {
    number: '02',
    title: 'Choose your event',
    description:
      'Explore the events, open the one you want, and complete the individual or team registration form.',
    icon: CheckCircle2,
  },
  {
    number: '03',
    title: 'Complete payment',
    description:
      'For paid events, complete the Razorpay payment. Free events can be registered directly without payment.',
    icon: CreditCard,
  },
  {
    number: '04',
    title: 'Open & save your pass',
    description:
      'After confirmation, open My Passes and keep your Digital Pass ready to show at the desk verification counter.',
    icon: Ticket,
  },
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 space-y-20 bg-[#04060a] overflow-x-hidden">
      <style>{`
        @keyframes homeFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes homeSoftFloat {
          0%, 100% {
            transform: scale(1.015) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.035) translate3d(-0.5%, -0.35%, 0);
          }
        }

        @keyframes homeGlowPulse {
          0%, 100% {
            opacity: 0.28;
          }
          50% {
            opacity: 0.5;
          }
        }

        .home-enter {
          opacity: 0;
          animation: homeFadeUp 0.75s ease-out forwards;
        }

        .home-hero-image {
          animation: homeSoftFloat 12s ease-in-out infinite;
          transform-origin: center center;
        }

        .home-glow {
          animation: homeGlowPulse 4s ease-in-out infinite;
        }

        .home-delay-1 { animation-delay: 0.08s; }
        .home-delay-2 { animation-delay: 0.16s; }
        .home-delay-3 { animation-delay: 0.24s; }
        .home-delay-4 { animation-delay: 0.32s; }
        .home-delay-5 { animation-delay: 0.42s; }

        @media (prefers-reduced-motion: reduce) {
          .home-enter {
            opacity: 1;
            animation: none;
          }

          .home-hero-image,
          .home-glow {
            animation: none;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-[#04060a]">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src={heroImg}
            alt="ITEKRON 2K26 Visual Background"
            className="home-hero-image w-full h-full object-cover object-top"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#04060a] via-[#04060a]/85 to-transparent/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-transparent to-[#04060a]/50" />
          <div className="absolute inset-0 bg-spider-web opacity-20 pointer-events-none" />
          <div className="home-glow absolute -right-24 top-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl text-left space-y-6">
            <div className="home-enter inline-flex items-center space-x-2 bg-red-950/80 border border-red-900/70 px-4 py-1.5 rounded-full text-red-400 text-xs font-bold tracking-widest uppercase shadow-xl shadow-red-950/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>National Level Technical Symposium</span>
            </div>

            <h1 className="home-enter home-delay-1 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none drop-shadow-lg">
              ITEKRON <br />
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-blue-500 bg-clip-text text-transparent">
                2K26
              </span>
            </h1>

            <p className="home-enter home-delay-2 text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed drop-shadow-md">
              Welcome to <strong className="text-white">ITEKRON 2K26</strong>, organized by the Department of Information Technology.
              Test your technical prowess, hackathon ingenuity, and UI design precision in a high-octane engineering arena.
            </p>

            <div className="home-enter home-delay-3 flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/events"
                className="spider-button-primary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-transform duration-300 hover:-translate-y-1"
              >
                <span>EXPLORE EVENTS</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/signup"
                className="spider-button-secondary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-transform duration-300 hover:-translate-y-1"
              >
                <span>REGISTER NOW</span>
              </Link>
            </div>

            <div className="home-enter home-delay-4 pt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Technical Events', val: '10+', icon: Cpu },
                { label: 'Colleges Expected', val: '50+', icon: Shield },
                { label: 'Symposium Date', val: '26 SEPT 2026', icon: Calendar },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="spider-card p-3.5 rounded-2xl text-left space-y-1 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-red-900/60"
                >
                  <stat.icon className="w-4 h-4 text-red-500 mb-1" />
                  <span className="text-base font-black text-white block">{stat.val}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT CATEGORIES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2 home-enter">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">
            Competitions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for <span className="text-blue-400">Innovators</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose from technical debugging, coding challenges, meme creation, and project showcases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="home-enter home-delay-1 spider-card spider-card-glow p-8 rounded-3xl space-y-4 transition-all duration-300 hover:-translate-y-2 hover:border-red-900/70">
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-900/50 w-fit text-red-500">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Coding & Debugging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test your logic and language proficiency in high-speed web debugging and code optimization challenges.
            </p>
            <Link href="/events" className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center space-x-1 transition-colors">
              <span>View Technical Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="home-enter home-delay-2 spider-card spider-card-glow p-8 rounded-3xl space-y-4 transition-all duration-300 hover:-translate-y-2 hover:border-blue-900/70">
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-900/50 w-fit text-blue-500">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Design & UI/UX</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Craft responsive user interfaces and cinematic digital visuals under strict symposium time limits.
            </p>
            <Link href="/events" className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1 transition-colors">
              <span>View Design Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="home-enter home-delay-3 spider-card spider-card-glow p-8 rounded-3xl space-y-4 transition-all duration-300 hover:-translate-y-2 hover:border-slate-700">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit text-slate-300">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Non-Technical</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express Gen Z creativity in meme creation, gaming showdowns, and rapid quiz rounds.
            </p>
            <Link href="/events" className="text-xs font-bold text-slate-300 hover:text-white inline-flex items-center space-x-1 transition-colors">
              <span>Explore Non-Tech</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW TO REGISTER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="spider-card rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-950/40 px-3 py-1 rounded-full border border-blue-900/40">
              Participant Guide
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How to <span className="text-red-400">Register</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Follow these four simple steps to register, complete your payment when required, and get your Digital Pass ready for the event day.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {registrationSteps.map((step, index) => (
              <div
                key={step.number}
                className={`home-enter home-delay-${Math.min(index + 1, 5)} relative rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-900/60`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-red-400">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-800">{step.number}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-7 rounded-2xl border border-red-900/40 bg-red-950/20 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Ticket className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">What is a Digital Pass?</strong>{' '}
              It is your event entry pass available after registration. Keep it saved on your phone and show it to the desk verification in-charge when you arrive at the symposium.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="spider-card p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden border-red-900/50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-blue-950/10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Ready to Claim Your Spot?</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Register for ITEKRON 2K26, get your Digital Pass, and be ready for verification on symposium day.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="spider-button-primary px-8 py-3.5 rounded-2xl text-xs font-bold inline-flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1"
              >
                Register for ITEKRON 2K26
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
