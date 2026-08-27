// I-TEKRON 2K26 — The Living Web: editorial About scene tethered to a single architectural web anchor.
import WebField from "@/components/WebField";

export default function AboutScene() {
  return (
    <section id="about" className="about-scene section-shell" aria-labelledby="about-title">
      <div className="about-scene__architecture" aria-hidden="true" />
      <WebField className="about-scene__web" />
      <div className="container about-scene__grid">
        <div className="about-scene__index" aria-hidden="true"><span>01</span><i /><em>Ideas in motion</em></div>
        <div className="about-scene__copy">
          <p className="section-kicker">The premise</p>
          <h2 id="about-title" className="section-title">A day where curiosity gets a practical shape.</h2>
          <p className="section-copy">I-Tekron 2K26 is the Department of Information Technology&apos;s flagship technical symposium, bringing together technology, creativity, problem solving and competition.</p>
          <a href="#events" className="about-scene__link">Trace the event network <span>↗</span></a>
        </div>
      </div>
    </section>
  );
}
