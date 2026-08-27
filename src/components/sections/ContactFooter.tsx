// I-TEKRON 2K26 — The Living Web: final contact scene where the city and web network settle into the footer.
import { ArrowUpRight, Instagram, Mail, MapPin } from "lucide-react";
import { navItems, siteMeta } from "@/data/siteData";
import WebField from "@/components/WebField";

export default function ContactFooter() {
  return (
    <footer id="contact" className="contact-footer" aria-labelledby="contact-title">
      <div className="contact-footer__architecture" aria-hidden="true" /><WebField className="contact-footer__web" />
      <div className="container contact-footer__top"><div><p className="section-kicker">Contact the department</p><h2 id="contact-title">The next signal begins here.</h2><p>Official coordinators, email, phone, social channels, and campus instructions will be announced by the Department of Information Technology.</p><a className="button-primary" href="#register">Trace registration updates <ArrowUpRight size={16} /></a></div><div className="contact-footer__details"><div><MapPin size={18} /><span><b>Venue</b>{siteMeta.venue}<small>{siteMeta.venueNote}</small></span></div><div><Mail size={18} /><span><b>Email</b>Official contact to be announced<small>Department of Information Technology</small></span></div><div><Instagram size={18} /><span><b>Social</b>Official channels to be announced<small>Follow I-TEKRON 2K26 updates</small></span></div></div></div>
      <div className="container contact-footer__bottom"><div className="contact-footer__brand"><span aria-hidden="true">✦</span><p>I-TEKRON <b>2K26</b><small>{siteMeta.eventType} · {siteMeta.department}</small></p></div><nav aria-label="Footer navigation">{navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><p>© 2026 I-TEKRON. Details subject to official announcement.</p></div>
    </footer>
  );
}
