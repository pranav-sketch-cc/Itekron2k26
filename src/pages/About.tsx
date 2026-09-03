import React from 'react';
import { Target, Users, Mail, Phone, ArrowRight, Code2, Palette, Gamepad2, Network } from 'lucide-react';
import { Link } from 'wouter';

export const About: React.FC = () => {
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

  const highlights = [
    {
      value: '10+',
      label: 'Events',
      description: 'Technical and non-technical challenges designed for different interests and skill sets.',
    },
    {
      value: '2',
      label: 'Event Categories',
      description: 'Technical brilliance and creative non-technical competition in one symposium.',
    },
    {
      value: '26',
      label: 'September 2026',
      description: 'The symposium day when participants step into the ITEKRON arena.',
    },
    {
      value: '50+',
      label: 'Colleges Expected',
      description: 'A platform built to bring students together through technology and competition.',
    },
  ];

  const participantExpectations = [
    {
      icon: Code2,
      title: 'Technical Challenges',
      description: 'Test your coding, debugging, logic, and problem-solving skills through focused technical events.',
      tone: 'red',
    },
    {
      icon: Palette,
      title: 'Creative Challenges',
      description: 'Showcase your design thinking and visual creativity through UI/UX and other creative challenges.',
      tone: 'blue',
    },
    {
      icon: Gamepad2,
      title: 'Non-Technical Events',
      description: 'Take a break from code with engaging quiz, gaming, meme, and other fast-paced competitions.',
      tone: 'slate',
    },
    {
      icon: Network,
      title: 'Networking & Exposure',
      description: 'Meet participants from different colleges and experience a competitive technical symposium environment.',
      tone: 'red',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 space-y-20 sm:space-y-24">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-5">
          <span className="inline-flex text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] bg-blue-950/40 px-3 py-1.5 rounded-full border border-blue-900/40">
            About ITEKRON 2K26
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]">
            More Than a{' '}
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-blue-500 bg-clip-text text-transparent">
              Symposium
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-7">
            ITEKRON 2K26 is the national level technical symposium organized by the Department of Information Technology at New Prince Shri Bhavani College. It brings technology, creativity, and competition together in one high-energy arena.
          </p>
        </div>
      </section>

      {/* At a glance */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="spider-card rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl font-black text-white tracking-tight">{item.value}</div>
              <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-400">
                {item.label}
              </div>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the symposium */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-8 items-stretch">
          <div className="spider-card rounded-3xl p-8 sm:p-10 border border-slate-800/80 relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em]">The ITEKRON Experience</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Where Ideas Meet <span className="text-blue-400">Competition</span>
              </h2>
              <p className="text-sm text-slate-400 leading-7 max-w-2xl">
                ITEKRON 2K26 is created as a platform for students to step beyond classrooms and put their skills into action. From technical problem-solving to creative challenges and non-technical events, every competition is designed to encourage participation, confidence, and innovation.
              </p>
              <p className="text-sm text-slate-400 leading-7 max-w-2xl">
                The symposium brings together students in an environment where technical mastery, collaborative thinking, creativity, and competitive spirit can come together.
              </p>
            </div>
            <div className="absolute -right-20 -bottom-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="spider-card rounded-3xl p-6 border border-red-900/40 flex flex-col justify-end min-h-[170px]">
              <div className="text-red-500 text-3xl font-black">Think.</div>
              <p className="mt-2 text-xs text-slate-500">Question ideas. Find better solutions.</p>
            </div>
            <div className="spider-card rounded-3xl p-6 border border-blue-900/40 flex flex-col justify-end min-h-[170px]">
              <div className="text-blue-400 text-3xl font-black">Build.</div>
              <p className="mt-2 text-xs text-slate-500">Turn knowledge into something real.</p>
            </div>
            <div className="spider-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-end min-h-[170px] col-span-2">
              <div className="text-white text-3xl font-black">Compete.</div>
              <p className="mt-2 text-xs text-slate-500">Step into the arena and showcase what you can do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">What Drives Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Vision & <span className="text-red-500">Mission</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="spider-card p-8 sm:p-10 rounded-3xl border-blue-900/40 space-y-5">
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-900/50 w-fit text-blue-500">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Our Vision</h3>
            <p className="text-sm text-slate-400 leading-7">
              To cultivate an inclusive and high-octane engineering community where passion for technology transcends boundaries, fostering future-ready innovators and thought leaders.
            </p>
          </div>

          <div className="spider-card p-8 sm:p-10 rounded-3xl border-red-900/40 space-y-5">
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-900/50 w-fit text-red-500">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Our Mission</h3>
            <p className="text-sm text-slate-400 leading-7">
              To provide a premium platform for students to showcase technical brilliance, collaborative design prowess, and problem-solving ingenuity under intense competition, bridging industry standards with academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Participant expectations */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">What Awaits You</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Come for the <span className="text-blue-400">Challenge</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            ITEKRON is built to give every participant something to test, create, learn, and compete for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {participantExpectations.map((item) => {
            const Icon = item.icon;
            const toneClasses =
              item.tone === 'red'
                ? 'border-red-900/40 text-red-500 bg-red-950/40'
                : item.tone === 'blue'
                  ? 'border-blue-900/40 text-blue-400 bg-blue-950/40'
                  : 'border-slate-800 text-slate-300 bg-slate-900';

            return (
              <div
                key={item.title}
                className="spider-card rounded-2xl p-6 border border-slate-800/80 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl border w-fit ${toneClasses}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why ITEKRON */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em]">Why ITEKRON?</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              Step out of the classroom.
              <span className="block text-blue-400">Step into the arena.</span>
            </h2>
            <p className="mt-5 text-sm text-slate-400 leading-7 max-w-2xl">
              Challenge your skills, showcase your creativity, meet fellow participants, and experience the competitive energy of ITEKRON 2K26.
            </p>
          </div>
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Organizing Team */}
      <section id="team" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Meet the Minds</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Organizing <span className="text-red-500">Team</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            The dedicated team from the IT Department of New Prince Shri Bhavani College working together to make ITEKRON 2K26 a reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizingTeam.map((member, index) => (
            <div
              key={`${member.role}-${member.name}-${index}`}
              className={`spider-card p-6 rounded-2xl border transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-2xl ${
                member.category === 'HEAD'
                  ? 'border-red-800 shadow-lg shadow-red-950/40 hover:border-red-500 hover:shadow-red-900/50'
                  : member.category === 'STAFF'
                    ? 'border-blue-900/60 hover:border-blue-500 hover:shadow-blue-900/30'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              <span
                className={`text-[10px] font-extrabold uppercase tracking-[0.16em] block leading-tight ${
                  member.category === 'HEAD'
                    ? 'text-red-400'
                    : member.category === 'STAFF'
                      ? 'text-blue-400'
                      : 'text-slate-500'
                }`}
              >
                {member.role}
              </span>
              <span className="mt-2 text-base sm:text-lg font-black text-white block leading-tight">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Support / CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="spider-card p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr,auto] items-center gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] bg-red-950/40 px-3 py-1.5 rounded-full border border-red-900/40">
                Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Need Assistance?</h2>
              <p className="text-sm text-slate-400 max-w-2xl leading-7">
                For registrations, partnerships, or any other inquiries, feel free to contact us. Our team is always here to help.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-5 text-xs sm:text-sm text-slate-300">
                <a href="mailto:itekron26@gmail.com" className="flex items-center gap-2.5 hover:text-blue-300 transition">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="font-mono text-blue-400">itekron26@gmail.com</span>
                </a>
                <a href="tel:+917010438705" className="flex items-center gap-2.5 hover:text-red-300 transition">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="font-mono text-red-400">+91 70104 38705</span>
                </a>
              </div>
            </div>

            <Link
              href="/events"
              className="spider-button-primary px-8 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 group whitespace-nowrap"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="absolute inset-0 bg-spider-web opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-4">
        <div className="text-center space-y-5">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Ready?</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Ready to enter the arena?</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Explore the events and find the competition that matches your skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/events" className="spider-button-primary px-8 py-3.5 rounded-2xl text-xs font-bold">
              Explore Events
            </Link>
            <Link href="/events" className="px-8 py-3.5 rounded-2xl text-xs font-bold border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition">
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
