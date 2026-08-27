import { useMemo } from "react";
import type { EventCategory, SymposiumEvent } from "@/data/siteData";
import { trpc } from "@/lib/trpc";

export type EventFilter = "all" | EventCategory;

type SupabaseEventRecord = {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string | null;
  team_type: string | null;
  team_size: string | null;
  date_time: string | null;
  venue: string | null;
  registration_deadline: string | null;
  rules_regulations: string | null;
};

export const LIVE_EVENTS_QUERY_OPTIONS = {
  refetchInterval: 15_000,
  refetchOnWindowFocus: true,
} as const;

function toCategory(category: SupabaseEventRecord["category"]): EventCategory {
  return category === "Technical" ? "technical" : "nonTechnical";
}

function formatDate(value: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function splitRules(value: string | null): string[] | undefined {
  const normalized = value?.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
  const rules = normalized?.split(/\r?\n/).map((rule) => rule.trim()).filter(Boolean);
  return rules?.length ? rules : undefined;
}

export function toSymposiumEvent(record: SupabaseEventRecord, index: number): SymposiumEvent {
  const team = [record.team_type, record.team_size].filter(Boolean).join(" · ");
  const dateTime = formatDate(record.date_time);
  const registrationDeadline = formatDate(record.registration_deadline);

  return {
    id: record.id,
    number: String(index + 1).padStart(2, "0"),
    category: toCategory(record.category),
    name: record.name,
    description: record.description ?? "Event details will be announced by the Department of Information Technology.",
    eventType: record.type,
    teamType: record.team_type ?? undefined,
    teamSize: record.team_size ?? undefined,
    dateTime,
    registrationDeadline,
    format: record.type,
    duration: team || "Team details to be announced",
    details: {
      rules: splitRules(record.rules_regulations),
      team: team || undefined,
      duration: dateTime,
      venue: record.venue ?? undefined,
      registration: registrationDeadline,
    },
  };
}

export function toSupabaseCategory(filter: EventFilter): "Technical" | "Non-Technical" | undefined {
  if (filter === "technical") return "Technical";
  if (filter === "nonTechnical") return "Non-Technical";
  return undefined;
}

export function filterLiveEvents(events: SymposiumEvent[], filter: EventFilter) {
  return filter === "all" ? events : events.filter((event) => event.category === filter);
}

export function getEventFilterLabel(filter: EventFilter) {
  if (filter === "all") return "All events";
  return filter === "technical" ? "Technical events" : "Non-Technical events";
}

export function useLiveEvents(filter: EventFilter = "all") {
  const category = toSupabaseCategory(filter);
  const query = trpc.events.list.useQuery(category ? { category } : undefined, LIVE_EVENTS_QUERY_OPTIONS);
  const events = useMemo(() => (query.data ?? []).map(toSymposiumEvent), [query.data]);

  return { ...query, events };
}

export function useLiveEvent(eventId: string | undefined) {
  return trpc.events.getById.useQuery(
    { id: eventId || "missing-event" },
    {
      enabled: Boolean(eventId),
      ...LIVE_EVENTS_QUERY_OPTIONS,
    },
  );
}
