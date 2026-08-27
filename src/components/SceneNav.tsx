// I-TEKRON 2K26 — The Living Web: floating navigation for one connected nocturnal page.
import { ChevronDown, LogOut, Menu, Ticket, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { navItems } from "@/data/siteData";
import { useAuth } from "@/contexts/AuthContext";

export function getProfileDisplay(fullName: string | null, email: string | null | undefined) {
  const name = fullName?.trim() || email || "Participant";
  return { name, initial: name.trim().charAt(0).toUpperCase() };
}

export default function SceneNav() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();
  const { participant, logoutParticipant } = useAuth();
  const isActive = (href: string) => href === "/events" ? location === href || location.startsWith("/events/") : location === href;

  const closeMenu = () => setOpen(false);
  const closeProfile = () => setProfileOpen(false);
  const { name: profileName, initial: profileInitial } = getProfileDisplay(participant?.fullName ?? null, participant?.email);

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) closeProfile();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProfile();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const handleParticipantLogout = () => {
    closeProfile();
    closeMenu();
    void logoutParticipant().then(() => setLocation("/"));
  };

  return (
    <header className="scene-nav is-scrolled">
      <div className="container scene-nav__inner">
        <Link href="/" className="scene-nav__brand" onClick={closeMenu} aria-label="I-Tekron home">
          <span className="scene-nav__mark" aria-hidden="true"><i /><i /><i /><i /><b /></span>
          <span><b>I-TEKRON</b><em>2K26</em></span>
        </Link>
        <nav className="scene-nav__links" aria-label="Primary navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <div className="scene-nav__account">
          {participant ? <div className="scene-nav__profile" ref={profileRef}>
            <button
              className="scene-nav__profile-trigger"
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-controls="participant-profile-menu"
              aria-label={`${profileName} profile menu`}
            >
              <span className="scene-nav__avatar" aria-hidden="true">{profileInitial}</span>
              <span className="scene-nav__profile-name" title={participant.email}>{profileName}</span>
              <ChevronDown className="scene-nav__profile-chevron" size={15} aria-hidden="true" />
            </button>
            <div id="participant-profile-menu" className={`scene-nav__profile-menu ${profileOpen ? "is-open" : ""}`} role="menu" aria-label="Participant profile">
              <Link href="/my-passes" role="menuitem" onClick={closeProfile}><Ticket size={15} aria-hidden="true" /> <span>My Passes</span></Link>
              <button type="button" role="menuitem" onClick={handleParticipantLogout}><LogOut size={15} aria-hidden="true" /> <span>Log out</span></button>
            </div>
          </div> : <><Link href={`/login?next=${encodeURIComponent(location)}`}>Login</Link><Link className="scene-nav__cta" href={`/signup?next=${encodeURIComponent(location)}`}>Sign Up</Link></>}
        </div>
        <button className="scene-nav__toggle" type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X size={21} /> : <Menu size={22} />}
        </button>
      </div>
      <nav className={`scene-nav__mobile ${open ? "is-open" : ""}`} aria-label="Mobile navigation">
        {navItems.map((item, index) => <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={isActive(item.href) ? "page" : undefined}><span>0{index + 1}</span>{item.label}</Link>)}
        {!participant && <><Link href={`/login?next=${encodeURIComponent(location)}`} onClick={closeMenu}>Login</Link><Link href={`/signup?next=${encodeURIComponent(location)}`} onClick={closeMenu}>Sign Up</Link></>}
      </nav>
    </header>
  );
}
