import React from "react";
import EventCard from "@/components/EventCard";
import EventDataState from "@/components/EventDataState";
import type { SymposiumEvent } from "@/data/siteData";
import { filterLiveEvents, getEventFilterLabel, type EventFilter } from "@/lib/liveEvents";

type EventCatalogueGridProps = {
  category: EventFilter;
  events: SymposiumEvent[];
  isLoading: boolean;
  isError: boolean;
};

export function EventCatalogueGrid({ category, events, isLoading, isError }: EventCatalogueGridProps) {
  const visibleEvents = filterLiveEvents(events, category);
  const label = getEventFilterLabel(category);

  return (
    <div className="event-catalogue__grid" role="tabpanel" aria-label={label}>
      {isLoading ? <EventDataState kind="loading" /> : null}
      {!isLoading && isError ? <EventDataState kind="error" /> : null}
      {!isLoading && !isError && visibleEvents.length ? visibleEvents.map((event, index) => <EventCard key={event.id} event={event} depth={index} />) : null}
      {!isLoading && !isError && !visibleEvents.length ? <EventDataState kind="empty" /> : null}
    </div>
  );
}
