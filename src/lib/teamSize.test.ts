import { describe, expect, it } from "vitest";
import { isEventRegistrationAvailable, parseTeamSizeRule } from "./teamSize";

describe("parseTeamSizeRule", () => {
  it("reads range, exact, and minimum-only live team-size formats", () => {
    expect(parseTeamSizeRule("2-3 members")).toEqual({ minimum: 2, maximum: 3 });
    expect(parseTeamSizeRule("2 members")).toEqual({ minimum: 2, maximum: 2 });
    expect(parseTeamSizeRule("Minimum 3 members")).toEqual({ minimum: 3 });
  });

  it("does not invent a team-size rule when event metadata is missing or malformed", () => {
    expect(parseTeamSizeRule(null)).toBeNull();
    expect(parseTeamSizeRule("team decided later")).toBeNull();
  });

  it("makes registration availability depend only on the live team metadata", () => {
    expect(isEventRegistrationAvailable("Individual", null)).toBe(true);
    expect(isEventRegistrationAvailable("Team", "2–3 members")).toBe(true);
    expect(isEventRegistrationAvailable("Team", null)).toBe(false);
    expect(isEventRegistrationAvailable(null, null)).toBe(false);
  });
});
