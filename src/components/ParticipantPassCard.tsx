// I-TEKRON 2K26 — a restrained physical-credential reveal that keeps the clean QR zone separate from web effects.
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { prototypeParticipant } from "@/data/participantData";
import "@/participant-tools.css";

export type PassParticipant = {
  name: string;
  college: string;
  registrationId: string;
  registeredEvents: string[];
  registrationStatus: "submitted" | "confirmed" | "cancelled";
};

const qrPattern = [
  "11100010111", "10101010101", "11101011111", "00010100010", "11011101110",
  "00100110001", "11101110111", "10100010101", "11111011111", "01001001010", "11101110111",
];

export default function ParticipantPassCard({ reveal = false, compact = false, participant }: { reveal?: boolean; compact?: boolean; participant?: PassParticipant }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!reveal);

  useEffect(() => {
    if (!reveal || !sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.22 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reveal]);

  const moveCard = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || compact) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cardRef.current.style.setProperty("--pass-rotate-x", `${-y * 3.5}deg`);
    cardRef.current.style.setProperty("--pass-rotate-y", `${x * 4.5}deg`);
  };

  const resetCard = () => {
    cardRef.current?.style.setProperty("--pass-rotate-x", "0deg");
    cardRef.current?.style.setProperty("--pass-rotate-y", "0deg");
  };

  const participantRecord: PassParticipant = participant ?? {
    name: prototypeParticipant.name,
    college: prototypeParticipant.college,
    registrationId: prototypeParticipant.registrationId,
    registeredEvents: prototypeParticipant.registeredEvents,
    registrationStatus: "confirmed",
  };

  return (
    <section ref={sectionRef} className={`participant-pass ${compact ? "participant-pass--compact" : ""} ${isVisible ? "is-revealed" : ""}`}>
      <div className="participant-pass__web participant-pass__web--back" aria-hidden="true"><i /><i /><i /></div>
      <div className="participant-pass__web participant-pass__web--front" aria-hidden="true"><i /><i /></div>
      <div className="container participant-pass__inner">
        {!compact && <div className="participant-pass__intro"><p className="section-kicker">05 · Participant credential</p><h2>Your I-TEKRON pass,<br /><em>on the signal.</em></h2><p>A prototype credential preview, positioned deeper in the experience. Official participant data will replace this record when registration opens.</p></div>}
        <div className="participant-pass__stage" onPointerMove={moveCard} onPointerLeave={resetCard}>
          <span className="participant-pass__tether" aria-hidden="true"><i /></span>
          <div ref={cardRef} className="pass-card">
            <div className="pass-card__top"><div><p className="pass-card__brand">I-TEKRON <b>2K26</b></p><span>Technical Symposium · Dept. of IT</span></div><small>{participant ? "PERSISTENT" : "PROTOTYPE"}<br />CREDENTIAL</small></div>
            <div className="pass-card__body"><div><p className="pass-card__label">Participant</p><h3>{participantRecord.name}</h3><p className="pass-card__institution">{participantRecord.college}</p><div className="pass-card__events"><p>Registered nodes</p><strong>{participantRecord.registeredEvents.join(" · ")}</strong></div></div><div className="pass-card__qr" aria-label="Credential QR visual indicator"><div className="pass-card__qr-grid">{qrPattern.flatMap((row, rowIndex) => row.split("").map((cell, colIndex) => <i key={`${rowIndex}-${colIndex}`} className={cell === "1" ? "is-on" : ""} />))}</div><small>VISUAL QR<br />INDICATOR</small></div></div>
            <div className="pass-card__bottom"><div><span>REG ID</span><strong>{participantRecord.registrationId}</strong></div><div><span>STATUS</span><strong><CheckCircle2 size={13} /> {participantRecord.registrationStatus}</strong></div><div><span>DATE</span><strong>{prototypeParticipant.eventDate}</strong></div></div>
          </div>
          {!compact && <Link href="/digital-pass" className="participant-pass__cta">View digital pass <ArrowUpRight size={16} /></Link>}
        </div>
      </div>
    </section>
  );
}
