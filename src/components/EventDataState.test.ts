import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EventDataState from "./EventDataState";

describe("EventDataState", () => {
  it("renders a contained loading status while the live programme is synchronising", () => {
    const markup = renderToStaticMarkup(createElement(EventDataState, { kind: "loading" }));

    expect(markup).toContain("Synchronising event nodes.");
    expect(markup).toContain('role="status"');
  });

  it("renders an accessible alert when the live event source is unavailable", () => {
    const markup = renderToStaticMarkup(createElement(EventDataState, { kind: "error" }));

    expect(markup).toContain("Event signal interrupted.");
    expect(markup).toContain('role="alert"');
  });

  it("renders an accessible empty state when a live category has no published events", () => {
    const markup = renderToStaticMarkup(createElement(EventDataState, { kind: "empty" }));

    expect(markup).toContain("No event nodes are published yet.");
    expect(markup).toContain('role="status"');
  });
});
