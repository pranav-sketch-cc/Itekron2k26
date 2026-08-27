import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { toSymposiumEvent } from "@/lib/liveEvents";
import { EventCatalogueGrid } from "./EventCatalogueGrid";

const technicalRecords = [
  ["COGNEXA01", "COGNEXA — The Ultimate Technology Quiz", "Technology Quiz"],
  ["CONVERA01", "CONVERA", "Paper Presentation"],
  ["MIND2CODE01", "Mind 2 Code", "Coding Challenge"],
  ["UXIFY01", "UXIfy", "UI/UX Design Challenge"],
  ["WEBBUGX01", "WebBugX — Debug. Detect. Dominate.", "Web Debugging Challenge"],
] as const;

describe("EventCatalogueGrid", () => {
  it("renders all five verified Technical Supabase records in the Technical catalogue", () => {
    const events = technicalRecords.map(([id, name, type], index) => toSymposiumEvent({
      id,
      name,
      category: "Technical",
      type,
      description: `${name} description`,
      team_type: "Individual",
      team_size: "1",
      date_time: null,
      venue: "IT Department",
      registration_deadline: null,
      rules_regulations: "Follow the event rules.",
    }, index));

    const markup = renderToStaticMarkup(createElement(
      Router,
      { ssrPath: "/events" },
      createElement(EventCatalogueGrid, {
        category: "technical",
        events,
        isLoading: false,
        isError: false,
      }),
    ));

    expect((markup.match(/event-card--route/g) ?? [])).toHaveLength(5);
    technicalRecords.forEach(([, name]) => expect(markup).toContain(name));
  });

  it("renders the same empty-state feedback for every live category view", () => {
    (['all', 'technical', 'nonTechnical'] as const).forEach((category) => {
      const markup = renderToStaticMarkup(createElement(
        Router,
        { ssrPath: "/events" },
        createElement(EventCatalogueGrid, {
          category,
          events: [],
          isLoading: false,
          isError: false,
        }),
      ));

      expect(markup).toContain("No event nodes are published yet.");
      expect(markup).not.toContain("event-card--route");
    });
  });

  it("prioritises loading and error feedback over stale event cards", () => {
    const event = toSymposiumEvent({
      id: "LOADING-EVENT",
      name: "Stale event",
      category: "Technical",
      type: "Test",
      description: null,
      team_type: null,
      team_size: null,
      date_time: null,
      venue: null,
      registration_deadline: null,
      rules_regulations: null,
    }, 0);

    const loadingMarkup = renderToStaticMarkup(createElement(Router, { ssrPath: "/events" }, createElement(EventCatalogueGrid, { category: "all", events: [event], isLoading: true, isError: false })));
    const errorMarkup = renderToStaticMarkup(createElement(Router, { ssrPath: "/events" }, createElement(EventCatalogueGrid, { category: "all", events: [event], isLoading: false, isError: true })));

    expect(loadingMarkup).toContain("Synchronising event nodes.");
    expect(loadingMarkup).not.toContain("Stale event");
    expect(errorMarkup).toContain("Event signal interrupted.");
    expect(errorMarkup).not.toContain("Stale event");
  });
});
