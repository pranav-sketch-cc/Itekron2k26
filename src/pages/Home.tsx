// I-TEKRON 2K26 — The Living Web: preserve the finite About-to-Events tilt-and-zoom handoff, with a deliberately shortened sticky travel before the existing Schedule section.
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "wouter";
import PageShell from "@/components/PageShell";
import HeroScene from "@/components/sections/HeroScene";
import AgendaWeb from "@/components/AgendaWeb";
import EventCard from "@/components/EventCard";
import WebField from "@/components/WebField";
import ParticipantPassCard from "@/components/ParticipantPassCard";
import EventDataState from "@/components/EventDataState";
import { schedule, sponsors } from "@/data/siteData";
import { getHomeTransitionMotion } from "@/lib/homeTransitionMotion";
import { useLiveEvents } from "@/lib/liveEvents";

export default function Home() {
  const transitionRef = useRef<HTMLElement>(null);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobileLayout, setMobileLayout] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(2000);
  const { events, isLoading: eventsLoading, isError: eventsError } = useLiveEvents();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 719px)");
    const syncLayout = () => setMobileLayout(media.matches);
    syncLayout();
    media.addEventListener("change", syncLayout);
    return () => media.removeEventListener("change", syncLayout);
  }, []);

  useEffect(() => {
    const transition = transitionRef.current;
    if (!transition) return;
    if (reducedMotion || mobileLayout) {
      setTransitionProgress(1);
      return;
    }

    let frame = 0;
    const updateDistance = () => setScrollDistance(Math.round(window.innerHeight * 1.35));
    const updateProgress = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const travel = Math.max(transition.offsetHeight - window.innerHeight, 1);
        const next = Math.min(1, Math.max(0, -transition.getBoundingClientRect().top / travel));
        setTransitionProgress((current) => (Math.abs(current - next) < 0.002 ? current : next));
        frame = 0;
      });
    };

    updateDistance();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateDistance, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateDistance);
      window.removeEventListener("resize", updateProgress);
      cancelAnimationFrame(frame);
    };
  }, [mobileLayout, reducedMotion]);

  const compactViewport = mobileLayout;
  const { aboutProgress, eventsProgress } = getHomeTransitionMotion(transitionProgress, reducedMotion);
  const aboutScale = compactViewport ? 0.982 : 0.952;
  const aboutTilt = compactViewport ? 2.2 : 4.8;
  const eventsScaleStart = compactViewport ? 0.984 : 0.966;
  const eventsTiltStart = compactViewport ? 1.7 : 3.6;
  const eventsRise = compactViewport ? 72 : 170;
  const rootStyle = { "--home-transition-distance": `${scrollDistance}px`, "--events-depth": eventsProgress } as CSSProperties;
  const aboutStyle = {
    filter: compactViewport ? "none" : `brightness(${1 - aboutProgress * 0.28}) saturate(${1 - aboutProgress * 0.1})`,
    opacity: compactViewport ? 1 - aboutProgress * 0.13 : 1,
    transform: `translate3d(0, 0, ${-aboutProgress * 110}px) rotateX(${-aboutProgress * aboutTilt}deg) scale(${1 - aboutProgress * (1 - aboutScale)})`,
  } as CSSProperties;
  const eventsStyle = {
    opacity: eventsProgress,
    transform: `translate3d(0, ${(1 - eventsProgress) * 100}%, -${(1 - eventsProgress) * eventsRise}px) rotateX(${(1 - eventsProgress) * eventsTiltStart}deg) scale(${eventsScaleStart + eventsProgress * (1 - eventsScaleStart)})`,
  } as CSSProperties;
  const transitionState = eventsProgress === 0 ? "about depth lock" : eventsProgress < 1 ? "events foreground rise" : "events settled";

  return <PageShell><HeroScene />
    <section ref={transitionRef} className={`home-layer-transition ${reducedMotion ? "is-reduced-motion" : ""} ${mobileLayout ? "is-mobile-layout" : ""}`} style={rootStyle} aria-label="About to events cinematic transition">
      <div className="home-layer-transition__pin">
        <section className="home-preview home-preview--about home-layer-transition__about" style={aboutStyle}><WebField className="home-preview__web" label="ABOUT NODE" /><div className="container home-preview__split"><div><p className="section-kicker">01 · The premise</p><h2>A day where curiosity gets a practical shape.</h2></div><div><p>I-TEKRON 2K26 is a Department of Information Technology symposium for innovators, creators, and future problem-solvers. It brings focused technical and cultural energy into one connected signal.</p><Link href="/about" className="text-link">Explore about <span>↗</span></Link></div></div></section>
        <section className="home-events-stage home-layer-transition__events" aria-label="Featured events panel">
          <div className="home-preview home-preview--events home-events-panel" style={eventsStyle}>
            <WebField className="home-preview__web" label="FEATURED NODES" />
            <div className="container"><div className="home-preview__heading"><div><p className="section-kicker">02 · Featured events</p><h2>Events attached to the next idea.</h2></div><Link href="/events" className="button-secondary">View all events <span>↓</span></Link></div><div className="home-preview__cards">{eventsLoading ? <EventDataState kind="loading" /> : eventsError ? <EventDataState kind="error" /> : events.length ? events.slice(0, 3).map((event, index) => <EventCard key={event.id} event={event} depth={index} />) : <EventDataState kind="empty" />}</div></div>
          </div>
        </section>
        <p className="home-layer-transition__status" aria-hidden="true">{transitionState} · {Math.round(transitionProgress * 100)}%</p>
      </div>
    </section>
    <AgendaWeb
      schedule={schedule.slice(0, 3)}
      variant="home"
      intro={<><p className="section-kicker">03 · Schedule preview</p><h2 id="agenda-title">A schedule that wakes as you move through it.</h2><Link href="/schedule" className="text-link">View full schedule <span>↗</span></Link></>}
    />
    <section className="home-preview home-preview--sponsors"><WebField className="home-preview__web" label="PARTNER SIGNAL" /><div className="container"><div className="home-preview__heading"><div><p className="section-kicker">04 · Partner network</p><h2>Partners will connect here.</h2></div><Link href="/sponsors" className="button-secondary">Our sponsors <span>↓</span></Link></div><div className="home-preview__sponsors">{sponsors.map((sponsor) => <div className="sponsor-placeholder" key={sponsor.id}><span>{sponsor.tier}</span><strong>{sponsor.name}</strong><small>Official mark to be announced</small></div>)}</div></div></section>
    <ParticipantPassCard reveal />
    <section className="home-final-cta"><WebField className="home-final-cta__web" label="REGISTRATION NODE" /><div className="container"><p className="section-kicker">Final signal</p><h2>Bring your idea to the next node.</h2><p>Registration status, official event rules, and coordinator details will be released by the department.</p><Link href="/register" className="button-primary">Trace registration status <span>↗</span></Link></div></section>
  </PageShell>;
}
