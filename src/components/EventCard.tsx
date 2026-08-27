// I-TEKRON 2K26 — a tethered event node that navigates to a real detail route, never a modal.
import React from "react";
import { ArrowUpRight, Clock3, Users } from "lucide-react";
import { Link } from "wouter";
import type { CSSProperties } from "react";
import type { SymposiumEvent } from "@/data/siteData";
import { isEventRegistrationAvailable } from "@/lib/teamSize";

export default function EventCard({ event, depth = 0 }: { event: SymposiumEvent; depth?: number }) {
  const isRegistrationAvailable = isEventRegistrationAvailable(event.teamType, event.teamSize);
  return <article className={`event-card event-card--route ${event.isPlaceholder ? "is-placeholder" : ""}`} style={{ "--card-depth": `${depth}` } as CSSProperties}>
    <div className="event-card__tether" aria-hidden="true"><i /><span /></div>
    <div className="event-card__anchor" aria-hidden="true"><i /><span /></div>
    <p className="event-card__number">{event.number}</p>
    <p className="event-card__category">{event.category === "technical" ? "Technical" : "Non-technical"}{event.isPlaceholder ? " · Brief pending" : ""}</p>
    <h3>{event.name}</h3><p className="event-card__description">{event.description}</p>
    <div className="event-card__meta"><span><Users size={13} /> {event.format}</span><span><Clock3 size={13} /> {event.duration}</span></div>
    <p className="event-card__status"><i /> {event.isPlaceholder ? "Awaiting official brief" : "Node ready to inspect"}</p>
    <div className="event-card__actions"><Link href={`/events/${event.id}`} className="event-card__link">View event <ArrowUpRight size={15} /></Link>{isRegistrationAvailable && <Link href={`/register?event=${encodeURIComponent(event.id)}`} className="event-card__link event-card__link--register">Register now <ArrowUpRight size={15} /></Link>}</div>
  </article>;
}
