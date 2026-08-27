// I-TEKRON 2K26 — full route-based event catalogue with exactly five cards per category.
import { useState } from "react";
import PageShell from "@/components/PageShell";
import PageMasthead from "@/components/PageMasthead";
import { EventCatalogueGrid } from "@/components/EventCatalogueGrid";
import WebField from "@/components/WebField";
import { getEventFilterLabel, type EventFilter, useLiveEvents } from "@/lib/liveEvents";

export default function Events() {
  const [category, setCategory] = useState<EventFilter>("all");
  const allEventsQuery = useLiveEvents();
  const selectedEventsQuery = useLiveEvents(category);
  const technicalCount = allEventsQuery.events.filter((event) => event.category === "technical").length;
  const nonTechnicalCount = allEventsQuery.events.filter((event) => event.category === "nonTechnical").length;
  const allCount = allEventsQuery.events.length;
  return <PageShell><PageMasthead index="02" eyebrow="Event catalogue · I-TEKRON 2K26" title="Technical + non-technical." copy="Trace live event nodes as the programme is updated by the Department of Information Technology." />
    <section className="page-scene event-catalogue"><WebField className="event-catalogue__web" label="CATALOGUE LIVE" /><div className="container"><div className="event-catalogue__tools"><div><p className="section-kicker">Choose a current</p><h2>{getEventFilterLabel(category)}</h2></div><div className="events-scene__tabs" role="tablist" aria-label="Event categories"><button type="button" role="tab" aria-selected={category === "all"} className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>All Events <span>{String(allCount).padStart(2, "0")}</span></button><button type="button" role="tab" aria-selected={category === "technical"} className={category === "technical" ? "is-active" : ""} onClick={() => setCategory("technical")}>Technical Events <span>{String(technicalCount).padStart(2, "0")}</span></button><button type="button" role="tab" aria-selected={category === "nonTechnical"} className={category === "nonTechnical" ? "is-active" : ""} onClick={() => setCategory("nonTechnical")}>Non-Technical Events <span>{String(nonTechnicalCount).padStart(2, "0")}</span></button></div></div><EventCatalogueGrid category={category} events={selectedEventsQuery.events} isLoading={selectedEventsQuery.isLoading} isError={selectedEventsQuery.isError} /></div></section>
  </PageShell>;
}
