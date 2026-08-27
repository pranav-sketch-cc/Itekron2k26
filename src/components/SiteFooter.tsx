// I-TEKRON 2K26 — global footer: the stable terminal of the Living Web.
import { Link, useLocation } from "wouter";
import { Instagram, Linkedin, MapPin, ShieldCheck, Youtube } from "lucide-react";
import { siteMeta } from "@/data/siteData";
import { useAuth } from "@/_core/hooks/useAuth";
import "@/footer.css";

const exploreLinks = [
  ["About the symposium", "/about"],
  ["All events", "/events"],
  ["Schedule", "/schedule"],
  ["Sponsors", "/sponsors"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
] as const;

const toolLinks = [
  ["Register", "/register"],
  ["Registration status", "/registration-status"],
  ["Digital pass", "/digital-pass"],
] as const;

const socialLinks = [
  ["Instagram", Instagram],
  ["LinkedIn", Linkedin],
  ["YouTube", Youtube],
] as const;

export default function SiteFooter() {
  const { isAuthenticated, logout, user } = useAuth();
  const [, navigate] = useLocation();
  const handleLogout = () => {
    void logout();
    navigate("/organizer-checkin");
  };
  return (
    <footer className="site-footer">
      <div className="site-footer__network" aria-hidden="true"><i /><i /><i /><span /><span /></div>
      <div className="site-footer__line" aria-hidden="true" />
      <div className="container site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__identity">
            <Link href="/" className="site-footer__brand" aria-label="I-Tekron home"><span className="site-footer__brand-mark" aria-hidden="true"><i /><i /><i /><i /><b /></span><p>I-TEKRON <b>2K26</b></p></Link>
            <p className="site-footer__descriptor">{siteMeta.eventType}<br />{siteMeta.department}</p>
            <p className="site-footer__venue"><MapPin size={14} /> <span>{siteMeta.venue}<small>{siteMeta.venueNote}</small></span></p>
          </div>
          <nav className="site-footer__column" aria-label="Explore">
            <p>Explore</p>
            {exploreLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <nav className="site-footer__column" aria-label="Participant tools">
            <p>Participant tools</p>
            {toolLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            {user?.role === "admin" ? <Link href="/organizer-checkin" className="site-footer__organizer"><ShieldCheck size={13} /> Organizer console</Link> : <Link href="/organizer-checkin" className="site-footer__organizer"><ShieldCheck size={13} /> Organizer sign-in</Link>}
            {isAuthenticated && <button type="button" className="site-footer__logout" onClick={handleLogout}>Log out</button>}
          </nav>
          <div className="site-footer__column site-footer__social">
            <p>Follow the signal</p>
            <div>{socialLinks.map(([label, Icon]) => <a key={label} href="#official-socials" aria-label={`${label} — official link to be added`} title="Official symposium link to be added" onClick={(event) => event.preventDefault()}><Icon size={17} /><span>{label}</span></a>)}</div>
            <small>Official channels incoming.</small>
          </div>
        </div>
        <div className="site-footer__bottom"><p>© 2026 I-Tekron 2K26. Department of Information Technology. <span aria-hidden="true">·</span> Designed for ideas in motion.</p></div>
      </div>
    </footer>
  );
}
