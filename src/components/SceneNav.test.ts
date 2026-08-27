import { describe, expect, it } from "vitest";
import { getProfileDisplay } from "./SceneNav";

describe("getProfileDisplay", () => {
  it("uses the authenticated participant name and first initial", () => {
    expect(getProfileDisplay("Aditi Rao", "aditi@example.com")).toEqual({ name: "Aditi Rao", initial: "A" });
  });

  it("falls back safely to email and then a neutral participant label", () => {
    expect(getProfileDisplay("   ", "participant@example.com")).toEqual({ name: "participant@example.com", initial: "P" });
    expect(getProfileDisplay(null, undefined)).toEqual({ name: "Participant", initial: "P" });
  });
});
