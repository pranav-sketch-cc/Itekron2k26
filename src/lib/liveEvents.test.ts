import { describe, expect, it } from "vitest";
import { filterLiveEvents, LIVE_EVENTS_QUERY_OPTIONS, toSupabaseCategory, toSymposiumEvent } from "./liveEvents";

describe("live event presentation mapping", () => {
  it("automatically refreshes Supabase event data and refetches when the visitor returns", () => {
    expect(LIVE_EVENTS_QUERY_OPTIONS).toEqual({
      refetchInterval: 15_000,
      refetchOnWindowFocus: true,
    });
  });

  it("maps every Supabase event field to the existing Event UI contract", () => {
    const event = toSymposiumEvent({
      id: "CONVERA01",
      name: "CONVERA",
      category: "Technical",
      type: "Paper Presentation",
      description: "Present research and ideas.",
      team_type: "Team",
      team_size: "2-3 members",
      date_time: "2026-09-26T04:30:00.000Z",
      venue: "Seminar Hall 2",
      registration_deadline: "2026-09-23T18:29:59.000Z",
      rules_regulations: "Judges' result will be final.\nBring a college ID.",
    }, 0);

    expect(event).toMatchObject({
      id: "CONVERA01",
      number: "01",
      category: "technical",
      eventType: "Paper Presentation",
      teamType: "Team",
      teamSize: "2-3 members",
      format: "Paper Presentation",
      details: { venue: "Seminar Hall 2", rules: ["Judges' result will be final.", "Bring a college ID."] },
    });
    expect(event.dateTime).toContain("Sep");
    expect(event.registrationDeadline).toContain("Sep");
  });

  it("normalizes escaped Supabase rule breaks for the existing detail-page list", () => {
    const event = toSymposiumEvent({
      id: "LIVE-RULES",
      name: "Rules event",
      category: "Non-Technical",
      type: "Live programme",
      description: null,
      team_type: null,
      team_size: null,
      date_time: null,
      venue: null,
      registration_deadline: null,
      rules_regulations: "Rule one\\nRule two",
    }, 0);

    expect(event.details.rules).toEqual(["Rule one", "Rule two"]);
  });

  it("maps category controls to the configured Supabase source values", () => {
    expect(toSupabaseCategory("all")).toBeUndefined();
    expect(toSupabaseCategory("technical")).toBe("Technical");
    expect(toSupabaseCategory("nonTechnical")).toBe("Non-Technical");
  });

  it("keeps all ten live records available while filtering five records for each source category", () => {
    const events = Array.from({ length: 10 }, (_, index) => toSymposiumEvent({
      id: `LIVE-${index + 1}`,
      name: `Live event ${index + 1}`,
      category: index < 5 ? "Technical" : "Non-Technical",
      type: "Live programme",
      description: null,
      team_type: null,
      team_size: null,
      date_time: null,
      venue: null,
      registration_deadline: null,
      rules_regulations: null,
    }, index));

    expect(filterLiveEvents(events, "all")).toHaveLength(10);
    expect(filterLiveEvents(events, "technical")).toHaveLength(5);
    expect(filterLiveEvents(events, "nonTechnical")).toHaveLength(5);
  });

  it("places a refreshed record in the category supplied by Supabase", () => {
    const baseRecord = {
      id: "LIVE-REFRESH",
      name: "Mutable live event",
      type: "Live programme",
      description: null,
      team_type: null,
      team_size: null,
      date_time: null,
      venue: null,
      registration_deadline: null,
      rules_regulations: null,
    };

    const beforeCategoryChange = toSymposiumEvent({ ...baseRecord, category: "Technical" }, 0);
    const afterCategoryChange = toSymposiumEvent({ ...baseRecord, category: "Non-Technical" }, 0);

    expect(filterLiveEvents([beforeCategoryChange], "technical")).toHaveLength(1);
    expect(filterLiveEvents([beforeCategoryChange], "nonTechnical")).toHaveLength(0);
    expect(filterLiveEvents([afterCategoryChange], "technical")).toHaveLength(0);
    expect(filterLiveEvents([afterCategoryChange], "nonTechnical")).toHaveLength(1);
  });
});
