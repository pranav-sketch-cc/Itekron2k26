import { describe, expect, it } from "vitest";
import { getHomeTransitionMotion } from "./homeTransitionMotion";

describe("getHomeTransitionMotion", () => {
  it("starts the incoming layer while the outgoing layer is still receding", () => {
    const motion = getHomeTransitionMotion(0.35);

    expect(motion.aboutProgress).toBeGreaterThan(0);
    expect(motion.aboutProgress).toBeLessThan(1);
    expect(motion.eventsProgress).toBeGreaterThan(0.35);
    expect(motion.eventsProgress).toBeLessThan(1);
  });

  it("settles both tracks at the end of the finite handoff", () => {
    expect(getHomeTransitionMotion(1)).toEqual({ aboutProgress: 1, eventsProgress: 1 });
  });

  it("uses a stable, accessible settled state for reduced motion", () => {
    expect(getHomeTransitionMotion(0.2, true)).toEqual({ aboutProgress: 1, eventsProgress: 1 });
  });
});
