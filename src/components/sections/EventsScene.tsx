// I-TEKRON 2K26 — The Living Web: web-tethered event cards with an accessible information panel.
import { ArrowUpRight, Clock3, Users, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import type { EventCategory, SymposiumEvent } from "@/data/siteData";
import WebField from "@/components/WebField";
import EventDataState from "@/components/EventDataState";
import { filterLiveEvents, getEventFilterLabel, type EventFilter, useLiveEvents } from "@/lib/liveEvents";

export default function EventsScene() {
  const [category, setCategory] = useState<EventFilter>("all");
  const [selected, setSelected] = useState<SymposiumEvent | null>(null);
  const { events, isLoading, isError } = useLiveEvents(category);
  const visibleEvents = filterLiveEvents(events, category);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (selected && !events.some((event) => event.id === selected.id)) setSelected(null);
  }, [events, selected]);

  return (
    <section id="events" className="events-scene section-shell" aria-labelledby="events-title">
      <div className="events-scene__architecture" aria-hidden="true" />
      <WebField className="events-scene__web" />
      <div className="container">
        <div className="events-scene__head">
          <div><p className="section-kicker">Select a node</p><h2 id="events-title" className="section-title">Events attached to the next idea.</h2></div>
          <div className="events-scene__tabs" role="tablist" aria-label="Event categories">
            <button type="button" role="tab" aria-selected={category === "all"} className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>All</button>
            <button type="button" role="tab" aria-selected={category === "technical"} className={category === "technical" ? "is-active" : ""} onClick={() => setCategory("technical")}>Technical</button>
            <button type="button" role="tab" aria-selected={category === "nonTechnical"} className={category === "nonTechnical" ? "is-active" : ""} onClick={() => setCategory("nonTechnical")}>Non-technical</button>
          </div>
        </div>
        <div className="events-scene__cards" role="tabpanel" aria-label={getEventFilterLabel(category)}>
          {isLoading ? <EventDataState kind="loading" /> : isError ? <EventDataState kind="error" /> : visibleEvents.length ? visibleEvents.map((event, index) => <article className="event-card" key={event.id} style={{ "--card-delay": `${index * 80}ms` } as CSSProperties}>
            <div className="event-card__tether" aria-hidden="true"><i /><span /></div>
            <p className="event-card__number">{event.number}</p>
            <h3>{event.name}</h3><p className="event-card__description">{event.description}</p>
            <div className="event-card__meta"><span><Users size={13} /> {event.format}</span><span><Clock3 size={13} /> {event.duration}</span></div>
            <button type="button" onClick={() => setSelected(event)}>View event <ArrowUpRight size={15} /></button>
          </article>) : <EventDataState kind="empty" />}
        </div>
      </div>
      {selected && <EventPanel event={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function EventPanel({ event, onClose }: { event: SymposiumEvent; onClose: () => void }) {
  return (
    <div className="event-panel__backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="event-panel" role="dialog" aria-modal="true" aria-labelledby="event-panel-title" onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}>
        <button className="event-panel__close" type="button" onClick={onClose} aria-label="Close event details"><X size={20} /></button>
        <p className="section-kicker">Event {event.number}</p><h3 id="event-panel-title">{event.name}</h3><p>{event.description}</p>
        <dl><div><dt>Type</dt><dd>{event.eventType}</dd></div>{event.details.team && <div><dt>Team</dt><dd>{event.details.team}</dd></div>}{event.dateTime && <div><dt>Date & time</dt><dd>{event.dateTime}</dd></div>}{event.details.venue && <div><dt>Venue</dt><dd>{event.details.venue}</dd></div>}{event.registrationDeadline && <div><dt>Registration deadline</dt><dd>{event.registrationDeadline}</dd></div>}</dl>
        {event.details.rules && <div className="event-panel__rules"><span>Rules</span><ul>{event.details.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>}
        <a href="#register" onClick={onClose} className="button-primary">Register interest <ArrowUpRight size={16} /></a>
      </aside>
    </div>
  );
}
