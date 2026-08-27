// I-TEKRON 2K26 — The Living Web: the confirmed supplied image is the sole clean hero visual; only its focal crop carries subtle scroll depth.
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { siteMeta } from "../../data/siteData";

const heroImageAsset = "/manus-storage/itekron_supplied_hero_aa1682b2.webp";

export default function HeroScene() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        root.style.setProperty("--hero-scroll", `${Math.min(window.scrollY, window.innerHeight) / window.innerHeight}`);
        scrollFrame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return (
    <section ref={rootRef} id="home" className="hero-scene" aria-labelledby="hero-title">
      <div className="hero-scene__image" style={{ backgroundImage: `url(${heroImageAsset})` }} aria-hidden="true" />
      <div className="container hero-scene__inner">
        <div className="hero-scene__content">
          <p className="section-kicker hero-scene__eyebrow">{siteMeta.department}</p>
          <h1 id="hero-title" className="hero-scene__title"><span>I-TEKRON</span><strong>2K26</strong></h1>
          <p className="hero-scene__type">{siteMeta.eventType}</p>
          <p className="hero-scene__tagline">Where ideas meet <b>momentum.</b></p>
          <div className="hero-scene__actions">
            <Link className="button-primary" href="/register">Register now <ArrowUpRight size={16} strokeWidth={2.2} /></Link>
            <Link className="button-secondary" href="/events">Explore events <ArrowDown size={16} strokeWidth={2.2} /></Link>
          </div>
        </div>
      </div>
      <div className="hero-scene__stats container" aria-label="Event overview">
        <div><span>Date</span><b>{siteMeta.date}</b><small>{siteMeta.dateNote}</small></div>
        <div><span>Venue</span><b>{siteMeta.venue}</b><small>{siteMeta.venueNote}</small></div>
        <div><span>Status</span><b>Registration opens soon</b><small>Prototype mode</small></div>
        <div><span>Programme</span><b>{siteMeta.programme}</b><small>Tech + Culture</small></div>
      </div>
    </section>
  );
}
