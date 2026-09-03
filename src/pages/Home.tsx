import React, { useEffect, useRef } from 'react';
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
  MousePointer2,
  Zap,
} from 'lucide-react';
import heroImg from '../assets/output.png';
import eventPoster from '../assets/itekron-poster.png';

const registrationSteps = [
  { number: '01', title: 'Create your account', description: 'Sign up with your email and verify your account before registering for an event.', icon: UserPlus },
  { number: '02', title: 'Choose your event', description: 'Explore the events, open the one you want, and complete the individual or team registration form.', icon: CheckCircle2 },
  { number: '03', title: 'Complete payment', description: 'For paid events, complete the Razorpay payment. Free events can be registered directly without payment.', icon: CreditCard },
  { number: '04', title: 'Open & save your pass', description: 'After confirmation, open My Passes and keep your Digital Pass ready to show at the desk verification counter.', icon: Ticket },
];

const posterHighlights = [
  { label: 'Technical', value: '5 Events', tone: 'red' },
  { label: 'Non-Technical', value: '5 Events', tone: 'blue' },
  { label: 'Event Date', value: '26 Sept 2026', tone: 'gold' },
];

export const Home: React.FC = () => {
  const revealRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = revealRootRef.current;
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -60px 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={revealRootRef} className="min-h-screen pt-16 space-y-20 bg-[#04060a] overflow-x-hidden">
      <style>{`
        @keyframes homeFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes homeSoftFloat { 0%,100% { transform: scale(1.015) translate3d(0,0,0); } 50% { transform: scale(1.045) translate3d(-0.45%,-0.3%,0); } }
        @keyframes homeGlowPulse { 0%,100% { opacity:.22; transform:scale(.96); } 50% { opacity:.5; transform:scale(1.04); } }
        @keyframes homeScan { 0% { transform:translateY(-120%); opacity:0; } 18% { opacity:.7; } 70% { opacity:.18; } 100% { transform:translateY(520%); opacity:0; } }
        @keyframes homePosterFloat { 0%,100% { transform:rotate(1.2deg) translateY(0); } 50% { transform:rotate(-1.2deg) translateY(-8px); } }
        @keyframes homePulseRing { 0%,100% { transform:scale(.96); opacity:.35; } 50% { transform:scale(1.04); opacity:.65; } }

        .home-enter { opacity:0; animation:homeFadeUp .8s cubic-bezier(.22,1,.36,1) forwards; }
        .home-delay-1 { animation-delay:.08s; }
        .home-delay-2 { animation-delay:.16s; }
        .home-delay-3 { animation-delay:.24s; }
        .home-delay-4 { animation-delay:.34s; }

        [data-reveal] { opacity:0; transform:translateY(48px) scale(.985); transition:opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1); }
        [data-reveal="left"] { transform:translateX(-60px) scale(.985); }
        [data-reveal="right"] { transform:translateX(60px) scale(.985); }
        [data-reveal="zoom"] { transform:scale(.9); }
        [data-reveal].is-visible { opacity:1; transform:translate3d(0,0,0) scale(1); }

        .home-hero-image { animation:homeSoftFloat 14s ease-in-out infinite; transform-origin:center center; }
        .home-glow { animation:homeGlowPulse 5s ease-in-out infinite; }
        .home-scan { animation:homeScan 8s linear infinite; }
        .home-poster { animation:homePosterFloat 7s ease-in-out infinite; }
        .home-pulse-ring { animation:homePulseRing 4s ease-in-out infinite; }

        .home-card-shine { position:relative; overflow:hidden; }
        .home-card-shine::after { content:''; position:absolute; inset:-100% 30% -100% -30%; background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.08) 50%,transparent 65%); transform:translateX(-90%); transition:transform .8s ease; pointer-events:none; }
        .home-card-shine:hover::after { transform:translateX(180%); }

        @media (prefers-reduced-motion: reduce) {
          .home-enter,.home-hero-image,.home-glow,.home-scan,.home-poster,.home-pulse-ring { animation:none; }
          [data-reveal],[data-reveal="left"],[data-reveal="right"],[data-reveal="zoom"] { opacity:1; transform:none; transition:none; }
        }
      `}</style>

      {/* HERO */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-[#04060a]">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img src={heroImg} alt="ITEKRON 2K26 Visual Background" className="home-hero-image w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04060a] via-[#04060a]/88 to-transparent/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-transparent to-[#04060a]/55" />
          <div className="absolute inset-0 bg-spider-web opacity-20 pointer-events-none" />
          <div className="home-glow absolute -right-24 top-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
          <div className="home-scan absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-transparent via-red-500/10 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl text-left space-y-6">
            <div className="home-enter inline-flex items-center space-x-2 bg-red-950/80 border border-red-900/70 px-4 py-1.5 rounded-full text-red-400 text-xs font-bold tracking-widest uppercase shadow-xl shadow-red-950/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Level Technical Symposium</span>
            </div>
            <h1 className="home-enter home-delay-1 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none drop-shadow-lg">
              ITEKRON <br />
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-blue-500 bg-clip-text text-transparent">2K26</span>
            </h1>
            <p className="home-enter home-delay-2 text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed drop-shadow-md">
              Welcome to <strong className="text-white">ITEKRON 2K26</strong>, organized by the Department of Information Technology. Test your technical prowess, creative thinking, and competitive spirit in a high-energy symposium arena.
            </p>
            <div className="home-enter home-delay-3 flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/events" className="spider-button-primary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/30">
                <span>EXPLORE EVENTS</span><ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/signup" className="spider-button-secondary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1">
                <span>REGISTER NOW</span>
              </Link>
            </div>
            <div className="home-enter home-delay-4 pt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label:'Technical Events', val:'10+', icon:Cpu },
                { label:'Colleges Expected', val:'50+', icon:Shield },
                { label:'Symposium Date', val:'26 SEPT 2026', icon:Calendar },
              ].map((stat, idx) => (
                <div key={idx} className="home-card-shine spider-card p-3.5 rounded-2xl text-left space-y-1 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-red-900/60 hover:shadow-lg hover:shadow-red-950/20">
                  <stat.icon className="w-4 h-4 text-red-500 mb-1" />
                  <span className="text-base font-black text-white block">{stat.val}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="home-enter home-delay-4 hidden sm:flex items-center gap-2 pt-2 text-[10px] text-slate-500 uppercase tracking-[0.22em]">
              <MousePointer2 className="w-3.5 h-3.5 text-red-500" />
              <span>Scroll to enter the ITEKRON experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL REVEAL EVENT POSTER */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-4">
        <div data-reveal="zoom" className="relative rounded-[2rem] border border-slate-800/80 bg-[#070a10] overflow-hidden shadow-2xl shadow-black/40">
          <div className="absolute inset-0 bg-spider-web opacity-10 pointer-events-none" />
          <div className="absolute -left-32 top-1/3 w-72 h-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -right-32 bottom-1/4 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] items-center gap-8 lg:gap-14 p-6 sm:p-10 lg:p-14">
            <div data-reveal="left" className="space-y-6 lg:pr-5">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] bg-red-950/40 px-3 py-1.5 rounded-full border border-red-900/40">
                <Zap className="w-3.5 h-3.5" /><span>The Spiderverse Awaits</span>
              </div>
              <div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  One Arena.<span className="block text-blue-400">Ten Ways to Compete.</span>
                </h2>
                <p className="mt-4 text-sm text-slate-400 leading-7 max-w-xl">
                  Get a quick visual overview of ITEKRON 2K26 before you dive into the individual event pages. Pick your challenge, register, and get your Digital Pass ready.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
                {posterHighlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <span className={`text-[9px] uppercase tracking-[0.16em] font-extrabold ${item.tone === 'red' ? 'text-red-400' : item.tone === 'blue' ? 'text-blue-400' : 'text-amber-300'}`}>{item.label}</span>
                    <div className="mt-2 text-sm font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/events" className="spider-button-primary px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform">
                  Explore all events <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-500">26 September 2026</span>
              </div>
            </div>
            <div data-reveal="right" className="relative flex justify-center lg:justify-end">
              <div className="home-pulse-ring absolute w-[88%] h-[88%] rounded-[2.5rem] border border-red-500/20 pointer-events-none" />
              <div className="home-poster relative w-full max-w-[500px] rounded-[1.6rem] p-2 bg-gradient-to-br from-red-500/30 via-slate-800 to-blue-500/20 shadow-2xl shadow-black/60">
                <div className="rounded-[1.25rem] overflow-hidden bg-black border border-white/10">
                  <img src={eventPoster} alt="ITEKRON 2K26 event poster" className="w-full h-auto block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT CATEGORIES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div data-reveal className="text-center space-y-2">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-900/40">Competitions</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Engineered for <span className="text-blue-400">Innovators</span></h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Choose from technical debugging, coding challenges, design challenges, and non-technical competitions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title:'Coding & Debugging', text:'Test your logic and language proficiency in high-speed web debugging and code optimization challenges.', icon:Code2, tone:'red', link:'View Technical Events' },
            { title:'Design & UI/UX', text:'Craft responsive user interfaces and cinematic digital visuals under strict symposium time limits.', icon:Terminal, tone:'blue', link:'View Design Challenges' },
            { title:'Non-Technical', text:'Express your creativity through meme creation, gaming showdowns, and rapid quiz rounds.', icon:Shield, tone:'slate', link:'Explore Non-Tech' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} data-reveal className={`home-card-shine spider-card p-8 rounded-3xl space-y-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${card.tone === 'red' ? 'hover:border-red-900/70 hover:shadow-red-950/20' : card.tone === 'blue' ? 'hover:border-blue-900/70 hover:shadow-blue-950/20' : 'hover:border-slate-700'}`}>
                <div className={`p-3.5 rounded-2xl w-fit border ${card.tone === 'red' ? 'bg-red-950/60 border-red-900/50 text-red-500' : card.tone === 'blue' ? 'bg-blue-950/60 border-blue-900/50 text-blue-500' : 'bg-slate-900 border-slate-800 text-slate-300'}`}><Icon className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
                <Link href="/events" className={`text-xs font-bold inline-flex items-center gap-1 transition-colors ${card.tone === 'red' ? 'text-red-400 hover:text-red-300' : card.tone === 'blue' ? 'text-blue-400 hover:text-blue-300' : 'text-slate-300 hover:text-white'}`}><span>{card.link}</span><ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW TO REGISTER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-reveal className="spider-card rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-950/40 px-3 py-1 rounded-full border border-blue-900/40">Participant Guide</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">How to <span className="text-red-400">Register</span></h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">Follow these four simple steps to register, complete your payment when required, and get your Digital Pass ready for the event day.</p>
          </div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {registrationSteps.map((step) => (
              <div key={step.number} data-reveal className="home-card-shine relative rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-900/60">
                <div className="flex items-center justify-between mb-5"><div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-red-400"><step.icon className="w-5 h-5" /></div><span className="text-2xl font-black text-slate-800">{step.number}</span></div>
                <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div data-reveal="left" className="relative z-10 mt-7 rounded-2xl border border-red-900/40 bg-red-950/20 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Ticket className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed"><strong className="text-white">What is a Digital Pass?</strong>{' '}It is your event entry pass available after registration. Keep it saved on your phone and show it to the desk verification in-charge when you arrive at the symposium.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div data-reveal="zoom" className="spider-card p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden border-red-900/50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-blue-950/10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Ready to Claim Your Spot?</h2>
            <p className="text-xs sm:text-sm text-slate-400">Register for ITEKRON 2K26, get your Digital Pass, and be ready for verification on symposium day.</p>
            <div className="pt-2"><Link href="/signup" className="spider-button-primary px-8 py-3.5 rounded-2xl text-xs font-bold inline-flex items-center gap-2 transition-transform duration-300 hover:-translate-y-1">Register for ITEKRON 2K26 <ArrowRight className="w-4 h-4" /></Link></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
