// I-TEKRON 2K26 — independent event detail page reached through a real URL.
import { ArrowLeft, ArrowUpRight, Clock3, MapPin, Users } from "lucide-react";
import { Link, useRoute } from "wouter";
import EventDataState from "@/components/EventDataState";
import PageShell from "@/components/PageShell";
import WebField from "@/components/WebField";
import { toSymposiumEvent, useLiveEvent } from "@/lib/liveEvents";
import { isEventRegistrationAvailable } from "@/lib/teamSize";

export default function EventDetail() {
  const [, params] = useRoute("/events/:eventId");
  const eventQuery = useLiveEvent(params?.eventId);
  if (eventQuery.isLoading) return <PageShell><section className="event-detail event-detail--missing"><div className="container"><EventDataState kind="loading" /></div></section></PageShell>;
  if (eventQuery.isError || !eventQuery.data) return <PageShell><section className="event-detail event-detail--missing"><div className="container"><p className="section-kicker">Signal not found</p><h1>This event node does not exist.</h1><p>The live event record could not be found. Please return to the current catalogue.</p><Link href="/events" className="button-primary">Back to events <ArrowLeft size={16} /></Link></div></section></PageShell>;
  const event = toSymposiumEvent(eventQuery.data, 0);
  const isRegistrationEvent = isEventRegistrationAvailable(event.teamType, event.teamSize);
  const detailRows = [
    { label: "Event type", value: event.eventType, icon: ArrowUpRight }, { label: "Team", value: event.details.team, icon: Users }, { label: "Date & time", value: event.dateTime, icon: Clock3 }, { label: "Venue", value: event.details.venue, icon: MapPin }, { label: "Registration deadline", value: event.registrationDeadline, icon: ArrowUpRight },
  ].filter((row) => row.value);
  return <PageShell><section className="event-detail"><div className="event-detail__structure" aria-hidden="true" /><WebField className="event-detail__web" label="EVENT NODE" /><div className="container event-detail__inner"><Link href="/events" className="back-link"><ArrowLeft size={16} /> Back to events</Link><div className="event-detail__intro"><div><p className="section-kicker">{event.category === "technical" ? "Technical event" : "Non-technical event"}</p><h1>{event.name}</h1><p>{event.description}</p></div><div className="event-detail__graphic"><span>NODE</span><b>LIVE</b><i /></div></div><div className="event-detail__body"><article><p className="section-kicker">Event details</p><h2>Trace the format.</h2><dl>{detailRows.map(({ label, value, icon: Icon }) => <div key={label}><dt><Icon size={15} /> {label}</dt><dd>{value}</dd></div>)}</dl></article><article><p className="section-kicker">Rules</p><h2>Read the current signal.</h2>{event.details.rules?.length ? <ul>{event.details.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul> : <p>Rules will be released with the official event brief. No unconfirmed rules are shown here.</p>}{isRegistrationEvent ? <Link href={`/register?event=${encodeURIComponent(event.id)}`} className="button-primary">Register now <ArrowUpRight size={16} /></Link> : <p className="event-detail__registration-note">Registration is not available for this event type.</p>}</article></div></div></section></PageShell>;
}
