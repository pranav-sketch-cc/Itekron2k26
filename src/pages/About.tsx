// I-TEKRON 2K26 — independent About route; editorial web anchor without duplicating the home hero.
import PageShell from "@/components/PageShell";
import PageMasthead from "@/components/PageMasthead";
import WebField from "@/components/WebField";

export default function About() {
  return <PageShell><PageMasthead index="01" eyebrow="About the symposium" title="A day where curiosity gets a practical shape." copy="I-TEKRON 2K26 is a Department of Information Technology technical symposium built for ideas that deserve a sharper next step." />
    <section className="page-scene about-page"><div className="about-page__architecture" aria-hidden="true" /><WebField className="about-page__web" label="IDEAS IN MOTION" /><div className="container about-page__grid"><div className="about-page__index">01 <span>PREMISE</span></div><div><p className="section-kicker">The premise</p><h2>Meet the next idea where it can move.</h2><p>I-TEKRON brings students, makers, creators, and future problem-solvers into one technical symposium. The programme balances practical inquiry, focused collaboration, and cultural energy—without static.</p><p>Final tracks, timing, rules, partners, prizes, and venue details remain subject to official Department of Information Technology announcements.</p></div><div className="about-page__signal"><span>NETWORK READING</span><b>Curiosity → Craft → Momentum</b><small>One connected programme · February 2026</small></div></div></section>
  </PageShell>;
}
